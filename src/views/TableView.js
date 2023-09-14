import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';
import {oneLineHtml} from '../helpers/format';

const template = oneLineHtml`
    <table>
        <thead>
            <tr>
                <th><span class="icon-checkmark"></span></th>
                <th>LV</th>
                <th>Weapon</th>
                {{#if (eq options/columnsType "stats")}}
                {{#each data/columns}}
                <th>{{this}}</th>
                {{/each}}
                {{else}}
                <th>Easy</th>
                <th>Normal</th>
                <th>Hard</th>
                <th>Hardest</th>
                <th>Inferno</th>
                {{/if}}
            </tr>
        </thead>
        <tbody>
            {{#each data/weapons}}
            {{#unless (and ../options/hideChecked (lookup ../settings name))}}
            <tr>
                <td><input type="checkbox"{{#if (lookup ../settings name)}} checked=""{{/if}}></td>
                <td class="align-right">{{lv}}</td>
                <td>{{name}}</td>
                {{#if (eq ../options/columnsType "stats")}}
                {{#each ../data/columns}}
                <td class="align-right">{{printValue (lookup ../stats this)}}</td>
                {{/each}}
                {{else}}
                {{#with ../options/columnsType}}
                <td class="align-right">{{printValue (lookup (lookup ../drops this) "easy")}}</td>
                <td class="align-right">{{printValue (lookup (lookup ../drops this) "normal")}}</td>
                <td class="align-right">{{printValue (lookup (lookup ../drops this) "hard")}}</td>
                <td class="align-right">{{printValue (lookup (lookup ../drops this) "hardest")}}</td>
                <td class="align-right">{{printValue (lookup (lookup ../drops this) "inferno")}}</td>
                {{/with}}
                {{/if}}
            </tr>
            {{#if (eq ../options/columnsType "stats")}}
            {{#each subWeapons}}
            <tr>
                <td></td>
                <td></td>
                <td>{{name}}</td>
                {{#each ../../data/columns}}
                <td class="align-right">{{printValue (lookup ../stats this)}}</td>
                {{/each}}
            </tr>
            {{/each}}
            {{/if}}
            {{/unless}}
            {{/each}}
        </tbody>
    </table>
    {{#each data/caveats}}
    <div>{{this}}</div>
    {{/each}}`;

export default Marionette.View.extend({
    template,
    events: {
        'change input[type="checkbox"]': 'onCheckboxChange'
    },
    initialize({data = {}, settings = {}, options = {}}) {
        _.defaults(options, {hideChecked: false, columnsType: 'stats'});
        this.model = new Backbone.Model({data, settings, options});
    },
    onCheckboxChange({target}) {
        const settings = this.model.get('settings');
        const row = this.$(target).closest('tr');
        const name = row.find('td:nth-child(3)').html();
        settings[name] = target.checked;
        this.model.set('settings', settings);
        this.trigger('settings:changed', settings);
        if (this.model.get('options').hideChecked) {
            this.render();
        }
    },
    onOptionsChange(options) {
        this.model.set('options', options);
        this.render();
    }
});
