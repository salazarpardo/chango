
import { SSL } from 'meteor/nourharidy:ssl';

var key = Assets.absoluteFilePath('server.key');
var cert = Assets.absoluteFilePath('server.cer');

SSL(key, cert, 9000);
