<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th class="text-left" v-for="item in headers" :key="item.value">
              {{ item.text }}
            <template v-if="item.help">
                <g-note>{{ item.help }}</g-note>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in list"
          :key="index"
        >
          <td v-for="keyItem in headers" :key="`${index}_${keyItem.value}`">
              <template v-if="keyItem.value">
                    <slot :name="`item.${keyItem.value}`" :item="item" :index="index">{{ item[keyItem.value] }}</slot>
              </template>
              <template v-else>
                    {{ item[keyItem.value] }}
              </template>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
    name: 'g-simple-table',
    props: {
        headers: Array,
        list: Array,
    },
    data() {
        return {
        };
    },
};
</script>

<style module>
</style>
