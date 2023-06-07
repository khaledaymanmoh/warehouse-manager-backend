import db from "./db";

const executeQuery = (query: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export default executeQuery;
