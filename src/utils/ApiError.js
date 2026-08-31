class ApiError extends Error{
    constructor(statusCode,message,success='false'){
        super(message);
        this.statusCode=statusCode;
        this.success=success
    }
}
export default ApiError