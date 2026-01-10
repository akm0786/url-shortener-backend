export const notFound = (req, res, next) => {
    // This runs when a user tries to go to a URL that doesn't exist
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); //PASS the error to the next function (The Error Handler)
};

export const errorHandler = (err, req, res, next) => {
    // If status is 200 (Success) but we are here, it's actually a 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        stack: err.stack // It is a map showing exactly which line of code caused the error
    });
};
