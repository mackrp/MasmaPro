import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxFavorite from './modules/favorite';
// const jqueryMin = require('./modules/jquery-2.1.1.min');
// const stepsForm = require('./modules/stepsForm');
// const inner = require('./modules/inner');


autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));
makeMap($('#map'));
const favoriteForms = $$('form.heart');
favoriteForms.on('submit', ajaxFavorite);
