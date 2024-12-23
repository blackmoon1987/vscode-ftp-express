const assert = require('assert');
const sinon = require('sinon');
const vscode = require('vscode');
const SyncHelper = require('../modules/sync-helper');

describe('Bulk Upload Tests', () => {
    let syncHelper;
    let mockFtp;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        mockFtp = {
            connect: sinon.stub().callsArg(1),
            upload: sinon.stub().callsArg(2)
        };
        syncHelper = SyncHelper({
            protocol: 'ftp',
            bulk: {
                batchSize: 2,
                batchTimeout: 1000,
                maxRetries: 2,
                showProgress: false
            }
        });
    });

    afterEach(() => {
        clock.restore();
    });

    it('should batch upload files correctly', (done) => {
        const files = [
            { path: '/test1.txt', rootPath: '/' },
            { path: '/test2.txt', rootPath: '/' },
            { path: '/test3.txt', rootPath: '/' }
        ];

        syncHelper.bulkUpload(files, (err) => {
            assert.strictEqual(err, null);
            assert.strictEqual(mockFtp.upload.callCount, 3);
            done();
        });

        clock.tick(1100);
    });

    it('should handle errors and retry', (done) => {
        const files = [
            { path: '/test1.txt', rootPath: '/' }
        ];

        mockFtp.upload
            .onFirstCall().callsArgWith(2, new Error('Upload failed'))
            .onSecondCall().callsArg(2);

        syncHelper.bulkUpload(files, (err) => {
            assert.strictEqual(err, null);
            assert.strictEqual(mockFtp.upload.callCount, 2);
            done();
        });

        clock.tick(1100);
    });

    it('should respect batch size limits', (done) => {
        const files = new Array(5).fill().map((_, i) => ({
            path: `/test${i}.txt`,
            rootPath: '/'
        }));

        let batchCounts = [];
        let currentBatch = 0;

        mockFtp.upload = sinon.stub().callsFake((path, dest, cb) => {
            batchCounts[currentBatch] = (batchCounts[currentBatch] || 0) + 1;
            setTimeout(cb, 10);
        });

        syncHelper.bulkUpload(files, () => {
            assert.deepStrictEqual(batchCounts, [2, 2, 1]);
            done();
        });

        clock.tick(1100);
    });
});
