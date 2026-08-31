const errorHandler=(err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal server error";
    const success=err.success || 'false'
    res.status(statusCode).json({
        success,
        message
    })
}
export {errorHandler}