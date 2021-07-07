'use strict';

module.exports = app => {

    require('./cache')(app);
    require('./globalErrorCatch')(app);

};
