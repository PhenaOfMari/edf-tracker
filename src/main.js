import './css/index.css';
import './assets/favicon.ico';
import _ from 'lodash';
import Marionette from 'marionette';
import Handlebars from 'handlebars';
import App from './App';
import {printValue, ifEq, and} from './helpers/handlebars';

function handlebarsRenderer(template, data) {
    if (_.isUndefined(template)) {
        return '';
    }
    if (_.isFunction(template)) {
        return template(data);
    }
    return Handlebars.compile(template)(data);
}

Handlebars.registerHelper('printValue', printValue);
Handlebars.registerHelper('if_eq', ifEq);
Handlebars.registerHelper('and', and);

Marionette.View.setRenderer(handlebarsRenderer);
Marionette.CollectionView.setRenderer(handlebarsRenderer);

document.addEventListener('DOMContentLoaded', () => {
    new App().start();
});
