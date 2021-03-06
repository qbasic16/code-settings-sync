"use strict";
var fs = require('fs');

export class File {
    
    constructor(public fileName: string, public content: string, private filePath) {
        // this.fileName = file.split('.')[0];
        //this.fileName = file;
    }
}
export class FileManager {

    public static FileExists(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            var stat: boolean = fs.existsSync(filePath);
            if (stat) {
                resolve(stat);
            }
            else resolve(stat);
        });
    }

    public static async ReadFile(filePath: string): Promise<string> {
        return new Promise<string>(async(resolve, reject) => {

            await fs.readFile(filePath, { encoding: 'utf8' }, function(err: any, data: any) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(data);

            });
        });
    }

    public static async GetFile(filePath : string , fileName : string) : Promise<File>{
        var me : FileManager = this;
        return new Promise<File>(async (resolve,reject)=>{
              await FileManager.FileExists(filePath).then(async function (fileExists: boolean) {
                    if (fileExists) {
                        FileManager.ReadFile(filePath).then(function (content: string) {
                            if (content!=null) {
                                var file: File = new File(fileName, content, filePath);
                                resolve(file);
                            }
                            resolve(null);
                        });
                    }
                    else{
                        resolve(null);
                    }
                });
        });
    }

    public static WriteFile(filePath: string, data: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (data) {
                fs.writeFile(filePath, data, function(err: any, data: any) {
                    if (err) {
                        console.error(err);
                        reject(false);
                    }
                    else {
                        resolve(true);
                    }
                });
            }
            else {
                console.error("Unable to write file. FilePath :" + filePath+" Data :"+ data);
                reject(false);
            }
        });
    }

    public static async ListFiles(directory: string): Promise<Array<File>> {
        var me = this;
        return new Promise<Array<File>>((resolve, reject) => {
            fs.readdir(directory, async function(err: any, data: Array<string>) {
                if (err) {
                    console.error(err);
                    reject(null);
                }

                var files = new Array<File>();
                for (var i = 0; i < data.length; i++) {
                    var file : File = await FileManager.GetFile(directory.concat(data[i]),data[i]);
                    files.push(file);
                }
                resolve(files);
            });

        });
    }

    public static async DeleteFile(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (filePath) {
                this.FileExists(filePath).then(async function(fileExists: boolean) {
                    if (fileExists) {
                        await fs.unlinkSync(filePath);
                    }
                    resolve(true);
                });
            }
            else {
                console.error("Unable to delete file. File Path is :" + filePath);
                reject(false);
            }
        });
    }

    public static async CreateDirectory(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (name) {
                this.FileExists(name).then(async function(dirExist: boolean) {
                    if (!dirExist) {
                        await fs.mkdirSync(name);

                    }
                    resolve(true);
                });
            }
            else {
                console.error("Unable to Create Directory. Dir Name is :" + name);
                reject(false);
            }
        });
    }

}