import Marionette from 'marionette';
import MainView from './views/MainView';

export default Marionette.Application.extend({
    region: {
        el: 'body'
    },
    onStart() {
        this.showView(new MainView());
    }
});
