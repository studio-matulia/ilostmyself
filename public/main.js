import { runShader } from './shader.js';
import { initLoadingAnimation } from './loadingScreen.js';
import { setText, setUuid, setBarcode, setContainerSizeAndVariable, setValues, setQrCode} from './artwork.js'
import { createIdfromUrl,getParametersFromUrl, setParametersInUrlAndReload} from './utils.js';

const par = getParametersFromUrl();
const id = createIdfromUrl();

setContainerSizeAndVariable();
runShader(par.a, par.b, par.c, par.d);
setText(par.a);
setQrCode(id);
setUuid(id);
setBarcode(par.c, id);
setValues(par.a, par.b, par.c, par.d);

initLoadingAnimation();

window.addEventListener('click', setParametersInUrlAndReload);
window.addEventListener('resize', function() {
    setContainerSizeAndVariable();
    setBarcode(par.c, id);
})
