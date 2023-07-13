<template>
    <div style="font-size: 10px;width: 400px;color: #333;" :loading="loading">
        <div :class="$style.title">
            <span style="margin-right:6px">{{info.CertificateName}}</span>
            <v-chip small color="primary">
                {{ info.CertificateType }}
            </v-chip>
        </div>
        <v-row >
            <v-col cols="6">
                <span  style="display:inline-block;width:100%">绑定域名：{{info.Domain}}</span>
            </v-col>
            <v-col cols="6">
                <span  style="display:inline-block;width:100%">签发时间：{{info.IssuingTime}}</span>
            </v-col>
        </v-row>
        <v-row >
            <v-col cols="6">
                <span  style="display:inline-block;width:100%">签发机构：{{info.IssuingAgency}}</span>
            </v-col>
            <v-col cols="6">
                <span style="display:inline-block;width:100%">到期时间：{{info.ExpiredTime}}</span>
            </v-col>
        </v-row>
    </div>
</template>
<script>
export default {
    name: 'certificate-info',
    props: {
        info: Object,
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {

        };
    },
};
</script>
<style module>
.title{
    font-size: 14px;
    color:#333333;
    font-weight: 400;
    margin-bottom: 24px;
}
</style>
