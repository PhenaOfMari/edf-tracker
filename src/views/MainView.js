import Backbone from 'backbone';
import Marionette from 'marionette';
import TabView from './TabView';
import TrackerView from './TrackerView';
import {oneLineHtml} from '../helpers/format';
import edf4data from '../assets/edf-4.1-data.json';
import edf5data from '../assets/edf-5-data.json';

const dataDictionary = {
    'EDF 4.1': JSON.parse(edf4data),
    'EDF 5': JSON.parse(edf5data)
};

const template = oneLineHtml`
    <a href="https://github.com/PhenaOfMari/edf-tracker" class="plug icon-github"></a>
    <div class="flex-column header">
        <label class="title">Progress faster than science!</label>
        <div class="flex-row">
            {{#with options}}
            <label for="columnsType">Displayed Columns</label>
            <select id="columnsType">
                <option value="stats"{{#if_eq columnsType "stats"}} selected=""{{/if_eq}}>Stats</option>
                <option value="offline"{{#if_eq columnsType "offline"}} selected=""{{/if_eq}}>Offline</option>
                <option value="online"{{#if_eq columnsType "online"}} selected=""{{/if_eq}}>Online</option>
                <option value="missionPack1"{{#if_eq columnsType "missionPack1"}} selected=""{{/if_eq}}>Mission Pack 1</option>
                <option value="missionPack2"{{#if_eq columnsType "missionPack2"}} selected=""{{/if_eq}}>Mission Pack 2</option>
            </select>
            <label for="hideChecked">Hide Collected</label>
            <input type="checkbox" id="hideChecked"{{#if hideChecked}} checked=""{{/if}}>
            {{/with}}
        </div>
    </div>
    <div class="flex-row">
        <div class="tabs vertical"></div>
        <div class="content"></div>
    </div>`;

export default Marionette.View.extend({
    template,
    className: 'flex-column tracker-main',
    regions: {
        tabs: '.tabs',
        content: '.content'
    },
    events: {
        'change .header input[type="checkbox"]': 'onCheckboxChange',
        'change .header select': 'onSelectChange'
    },
    childViewEventPrefix: 'child:view',
    initialize() {
        this.settings = JSON.parse(localStorage.getItem('settings') ?? '{}');
        this.selectedTabs = JSON.parse(localStorage.getItem('selectedTabs') ?? '[]');
        [this.selectedTab] = this.selectedTabs;
        const hideChecked = localStorage.getItem('hideChecked') ?? false;
        const columnsType = localStorage.getItem('columnsType') ?? 'stats';
        const options = {hideChecked, columnsType};
        this.model = new Backbone.Model({options});
    },
    onDomRefresh() {
        const tabs = ['EDF 4.1', 'EDF 5'];
        const selected = this.selectedTab ?? tabs[0];
        const data = dataDictionary[selected];
        const settings = this.settings[selected] ?? {};
        const selectedTabs = this.selectedTabs.slice(1);
        const options = this.model.get('options');
        this.showChildView('tabs', new TabView({tabs, selected}));
        this.showChildView('content', new TrackerView({data, settings, selectedTabs, options}));
    },
    onChildViewSelected(selection) {
        this.selectedTab = selection;
        const data = dataDictionary[selection];
        const settings = this.settings[selection] ?? {};
        const options = this.model.get('options');
        this.showChildView('content', new TrackerView({data, settings, options}));
    },
    onChildViewContentSelected(newSelectedTabs) {
        this.selectedTabs = [this.selectedTab, ...newSelectedTabs];
        localStorage.setItem('selectedTabs', JSON.stringify(this.selectedTabs));
    },
    onChildViewSettingsChanged(newSettings) {
        this.settings[this.selectedTab] = newSettings;
        localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    onCheckboxChange(event) {
        const hideChecked = event.target.checked;
        const options = this.model.get('options');
        options.hideChecked = hideChecked;
        localStorage.setItem('hideChecked', hideChecked);
        this.triggerMethod('options:change', options);
    },
    onSelectChange(event) {
        const columnsType = event.target.value;
        const options = this.model.get('options');
        options.columnsType = columnsType;
        localStorage.setItem('columnsType', columnsType);
        this.triggerMethod('options:change', options);
    },
    onOptionsChange(options) {
        this.getChildView('content').triggerMethod('options:change', options);
    }
});
