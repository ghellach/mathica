import {Mathica} from './app.js';

(function () {


    console.log("")
    // initial process workers
    const start = new Date();
    
    const math = Mathica.default(process.argv[2]);
    
    console.log("");
    console.log((new Date()-start)/1000, "seconds to execute");
    return;

})();