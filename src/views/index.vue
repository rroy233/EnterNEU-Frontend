<template>
  <dir>
    <v-container>
      <v-alert
        icon="mdi-shield-lock-outline"
        prominent
        text
        type="info"
        class="mt-5"
      >
        <v-row align="center">
          <v-col class="grow">
            欢迎使用            
          </v-col>
          <v-col class="shrink">
            <v-btn text color="primary" @click="showTips=true">说明文档</v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <v-form ref="form" lazy-validation>
        <v-text-field v-model="name" label="姓名(例如：孙*川)" outlined></v-text-field>
        <v-text-field v-model="stuID" label="学号" outlined></v-text-field>
        <v-text-field
          v-model="entranceName"
          label="入口名(格式:xx校区xx门)"
          outlined
        ></v-text-field>
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="TextSelect"
            :items="TextItems"
            item-text="configValue"
            item-value="configName"
            label="提示文本"
            outlined
            class="mx-2"
          ></v-select>
          <v-select
            v-model="VehicleSelect"
            :items="VehicleItems"
            item-text="configValue"
            item-value="configName"
            label="方向"
            outlined
            class="mx-2"
          ></v-select>
          <v-select
            v-model="ExpTimeSelect"
            :items="ExpTimeItems"
            item-text="configValue"
            item-value="configName"
            label="过期时间"
            outlined
            class="mx-2"
          ></v-select>
        </v-col>

        <v-btn
          block
          class="my-4"
          @click="submit()"
          @keyup.enter.native="submit"
          depressed
          color="primary"
        >
          生成
        </v-btn>
      </v-form>
      <div class="text-caption text-center">您此次会话的秘钥 <br><code>{{ key }}</code></div>
    </v-container>
    <!-- 提示框 -->
    <v-dialog v-model="config.alert" max-width="450px">
      <v-card>
        <v-card-title>{{ config.alert_type }}</v-card-title>
        <v-card-text>
          {{ config.alert_text }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="config.alert = !config.alert"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Tips :show="showTips" @close="showTips=false"></Tips>
  </dir>
</template>

<script>
import Tips from  '../components/Tips.vue'
export default {
  name: "index",
  components:{
    Tips
  },
  data: function () {
    return {
      name: "",
      stuID: "",
      entranceName: "",
      key: "正在获取",
      keyMD5: "",
      TextSelect: "5",
      TextItems: [{ configName: "0", configValue: "未经审核" }],
      VehicleSelect: "0",
      VehicleItems: [{ configName: "0", configValue: "入" }],
      ExpTimeSelect: "0",
      ExpTimeItems: [{ configName: "0", configValue: "1小时" }],
      config: {
        alert_text: "",
        alert_type: "info",
        alert: false,
      },
      dialog: false,
      showTips:false
    };
  },
  mounted: function () {
    var _this = this;

    //获取秘钥
    this.axios({
      url: "/api/randKey",
      method: "get",
    })
      .then((res) => {
        if (res.data.status == 0) {
          _this.key = res.data.data.key;
          _this.keyMD5 = res.data.data.MD5;
        } else {
          _this.error(res.data.msg);
        }
      })
      .catch((err) => {
        _this.error(err);
      });

    //获取配置项
    this.axios({
      url: "/api/config",
      method: "get",
    })
      .then((res) => {
        if (res.data.status == 0) {
          _this.TextItems = res.data.data.codeType;
          _this.VehicleItems = res.data.data.actualVehicle;
          _this.ExpTimeItems = res.data.data.expTime;
        } else {
          _this.error(res.data.msg);
        }
      })
      .catch((err) => {
        _this.error(err);
      });
      console.log(this);
  },
  methods: {
    submit: function () {
      var _this = this;
      console.log(this.ExpTimeSelect+this.ExpTimeSelect.configName);
      this.axios({
        url: "/api/store",
        method: "post",
        data: {
          key: this.key,
          keyMD5: this.keyMD5,
          name: this.name,
          stuID: this.stuID,
          entranceName: this.entranceName,
          actualVehicle: this.VehicleSelect,
          codeType: this.TextSelect,
          expTimeType: parseInt(this.ExpTimeSelect),
        },
      })
        .then((res) => {
          if (res.data.status == 0) {
            _this.success("创建成功");
            setTimeout(function () {
                _this.$router.push(res.data.data.vueUrl);
              }, 1000);
          } else {
            _this.error(res.data.msg);
          }
        })
        .catch((err) => {
          _this.error(err);
        });
    },
    success: function (text) {
      this.config.alert = !this.config.alert;
      this.config.alert_text = text;
      this.config.alert_type = "成功";
    },
    error: function (err) {
      this.config.alert = !this.config.alert;
      this.config.alert_text = err;
      this.config.alert_type = "错误";
    },
  },
};
</script>

<style></style>
