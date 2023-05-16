import request from "request";

export const download = (
  url: string,
  callback: (body: any, err: any) => void
) => {
  request(url, (err, res, body) => {
    callback(body, err);
  });
};
