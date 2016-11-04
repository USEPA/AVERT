// class EereException extends Error {
class EereException {
    constructor(value,limit) {
        this.value = value;
        this.limit = limit;
        this.name = 'EereException';
        this.message = `Value exceeds allowable limit: ${this.limit}`;
    }

}

export default EereException;