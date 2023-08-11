import Backbone from 'backbone';
import Marionette from 'marionette';
import {oneLineHtml} from '../helpers/format';

const template = oneLineHtml`
    {{#each tabs}}
    <div class="tab{{#if_eq ../selected this}} selected{{/if_eq}}">{{this}}</div>
    {{/each}}`;

export default Marionette.View.extend({
    template,
    className: 'tab-container',
    events: {
        'click .tab': 'onClick'
    },
    initialize({type = 'vertical', tabs = [], selected = ''}) {
        this.model = new Backbone.Model({type, tabs, selected});
    },
    onClick(event) {
        const newSelected = event.target.innerHTML;
        this.$('.selected').removeClass('selected');
        this.$(event.target).addClass('selected');
        this.model.set('selected', newSelected);
        this.trigger('selected', newSelected);
    }
});
