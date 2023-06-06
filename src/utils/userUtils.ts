import bcrypt from "bcrypt";

export async function validateUserPassword(myPlaintextPassword: string, hash: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}