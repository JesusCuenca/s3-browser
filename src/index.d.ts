export interface S3Folder {
  isFolder: true;
  name: string;
  prefix: string,
  creationDate?: Date;
}

export interface S3Object {
  isObject: true;
  name: string;
  lastModified: Date;
  size: number;
  etag: string;
}

export type S3FolderOrObject = S3Folder | S3Object;

export interface PathItem {
  name: string;
  path: Path;
  prefix: string,
  key: string;
}

export type Path = PathItem[];
