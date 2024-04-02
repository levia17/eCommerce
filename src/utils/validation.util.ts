
export function ValidationUtils(allow: string[], object: object): Boolean {
    let check;

    for (const field in object) {

        if (allow.includes(field)) {
            check = true;
        } else {
            check = false;
        }

        console.log('Fields name: ', field);
        console.log('Check: ', check);

    }


    return check;
}

