import Marionette from 'marionette';
import TabView from './TabView';
import TableView from './TableView';
import {oneLineHtml} from '../helpers/format';

const template = oneLineHtml`
    <div class="tabs horizontal"></div>
    <div class="content"></div>`;

export default Marionette.View.extend({
    template,
    className: 'flex-column',
    regions: {
        tabs: '.tabs',
        content: '.content'
    },
    childViewEventPrefix: 'child:view',
    initialize({data = {}, settings = {}, selectedTabs = [], options = {}}) {
        this.data = data;
        this.settings = settings;
        [this.selectedTab] = selectedTabs;
        this.options = options;
    },
    onDomRefresh() {
        const tabs = this.data.map(item => item.type);
        const selected = this.selectedTab ?? tabs[0] ?? '';
        this.selectedTab = selected;
        const data = this.data.find(item => item.type === selected);
        const settings = this.settings[selected] ?? {};
        const {options} = this;
        this.showChildView('tabs', new TabView({tabs, selected}));
        this.showChildView('content', new TableView({data, settings, options}));
        this.trigger('content:selected', [selected]);
    },
    onChildViewSelected(selection) {
        this.selectedTab = selection;
        const data = this.data.find(item => item.type === selection);
        const settings = this.settings[selection] ?? {};
        const {options} = this;
        this.showChildView('content', new TableView({data, settings, options}));
        this.trigger('content:selected', [selection]);
    },
    onChildViewSettingsChanged(newSettings) {
        this.settings[this.selectedTab] = newSettings;
        this.trigger('settings:changed', this.settings);
    },
    onOptionsChange(options) {
        this.options = options;
        this.getChildView('content').triggerMethod('options:change', options);
    }
});
