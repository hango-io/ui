import Vue from 'vue';
import smartTimestamp from './smartTimestamp';
import publishType from './publishType';

Vue.filter('smartTimestamp', smartTimestamp);
Vue.filter('publishType', publishType);
