import { BadRequestException, Injectable } from "@nestjs/common";
import { get } from 'lodash';
import { auth, rs, conf, zone, form_up } from 'qiniu';
import { INestService } from "./INestService";
import { Store } from "../stores/Store";
import { REDUX_STORE } from "../../constants/Store";
import { IState } from "../../reducers";
import { SongService } from "./SongService";
import * as stream from "stream";
import { ICloudSong } from "../../interfaces/ICloudSong";

@Injectable()
export class CloudService implements INestService {
    private store: Store;

    constructor(
        private readonly songService: SongService,
    ) {
    }

    init(app: Electron.App, window: Electron.BrowserWindow, store: Store): Promise<void> | void {
        this.store = store;
    }

    public async listCloudSongs(marker?: string, limit: number = 1000): Promise<{ items: ICloudSong[] }> {
        const state: IState = this.store.get(REDUX_STORE);
        const accessKey = get(state, 'cloud.accessKey');
        const secretKey = get(state, 'cloud.secretKey');
        if (!accessKey || !secretKey) {
            throw new BadRequestException('请先配置云盘');
        }
        const mac = new auth.digest.Mac(accessKey, secretKey);
        const config = new conf.Config({ zone: zone[get(state, 'cloud.zone', 'Zone_z1')] });
        const bucketManager = new rs.BucketManager(mac, config);
        const bucket = get(state, 'cloud.bucket');
        return new Promise((resolve, reject) => {
            bucketManager.listPrefix(bucket, { marker, limit }, function (err, respBody) {
                if (err) {
                    return reject(err);
                }
                resolve(respBody);
            });
        })
    }

    public async uploadSong(songId: string, songType: string) {
        const { url, filename } = await this.songService.getSong(songId, songType);
        const state: IState = this.store.get(REDUX_STORE);
        const accessKey = get(state, 'cloud.accessKey');
        const secretKey = get(state, 'cloud.secretKey');
        if (!accessKey || !secretKey) {
            throw new BadRequestException('请先配置云盘');
        }
        const mac = new auth.digest.Mac(accessKey, secretKey);
        const config = new conf.Config({ zone: zone[get(state, 'cloud.zone', 'Zone_z1')] });
        const bucketManager = new rs.BucketManager(mac, config);
        const bucket = get(state, 'cloud.bucket');
        return new Promise((resolve, reject) => {
            bucketManager.fetch(
                url.hqurl || url.squrl || url.lqurl,
                bucket,
                filename,
                (err) => err ? reject(err) : resolve()
            );
        })
    }

    public async uploadLocalSong(filename: string, stream: stream.Stream) {
        const state: IState = this.store.get(REDUX_STORE);
        const accessKey = get(state, 'cloud.accessKey');
        const secretKey = get(state, 'cloud.secretKey');
        if (!accessKey || !secretKey) {
            throw new BadRequestException('请先配置云盘');
        }
        const mac = new auth.digest.Mac(accessKey, secretKey);
        const config = new conf.Config({ zone: zone[get(state, 'cloud.zone', 'Zone_z1')] });
        const putPolicy = new rs.PutPolicy({ scope: get(state, 'cloud.bucket') });
        const uploadToken = putPolicy.uploadToken(mac);
        const formUploader = new form_up.FormUploader(config);

        return new Promise((resolve, reject) => {
            formUploader.putStream(
                uploadToken,
                filename,
                stream as NodeJS.ReadableStream,
                new form_up.PutExtra(),
                err => err ? reject(err) : resolve()
            );
        })
    }
}
