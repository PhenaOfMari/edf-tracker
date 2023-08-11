import Marionette from 'marionette';
import TabView from './TabView';
import ClassView from './ClassView';
import {oneLineHtml} from '../helpers/format';

const template = oneLineHtml`
    <div class="tabs vertical"></div>
    <div class="content"></div>`;

export default Marionette.View.extend({
    template,
    className: 'flex-row',
    regions: {
        tabs: '.tabs',
        content: '.content'
    },
    childViewEventPrefix: 'child:view',
    initialize({data = {}, settings = {}, selectedTabs = [], options = {}}) {
        this.data = data;
        this.settings = settings;
        this.selectedTabs = selectedTabs;
        [this.selectedTab] = selectedTabs;
        this.options = options;
    },
    onDomRefresh() {
        const tabs = this.data.map(item => item.name);
        const selected = this.selectedTab ?? tabs[0] ?? '';
        this.selectedTab = selected;
        const data = this.data.find(item => item.name === selected).weaponGroups;
        const settings = this.settings[selected] ?? {};
        const selectedTabs = this.selectedTabs.slice(1);
        const {options} = this;
        this.showChildView('tabs', new TabView({tabs, selected}));
        this.showChildView('content', new ClassView({data, settings, selectedTabs, options}));
    },
    onChildViewSelected(selection) {
        this.selectedTab = selection;
        const data = this.data.find(item => item.name === selection).weaponGroups;
        const settings = this.settings[selection] ?? {};
        const {options} = this;
        this.showChildView('content', new ClassView({data, settings, options}));
    },
    onChildViewContentSelected(newSelectedTabs) {
        this.trigger('content:selected', [this.selectedTab, ...newSelectedTabs]);
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
