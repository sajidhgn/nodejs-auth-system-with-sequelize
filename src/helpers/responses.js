module.exports = {
    success: (res, data, message = 'Success') => {
        return res.status(200).json({ success: true, data, message });
    },

    error: (res, message = 'Error', err, status = 200) => {
        return res.status(status).json({ success: false, message });
    },
    unauthorized: (res, message = 'Unauthorized') => {
        return res.status(401).json({ success: false, message });
    }
};