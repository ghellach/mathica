import {Mathica} from './app.js';

(function () {

    // initial process workers
    const start = new Date();
    
    const math = Mathica.default(process.argv[2]);
    
    console.log((new Date()-start)/1000, "seconds to execute");
    return;

})();