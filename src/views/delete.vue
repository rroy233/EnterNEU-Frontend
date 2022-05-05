<template>
  <div>
    <v-container v-show="view == 0">
        <div class="mt-6 mb-2 d-flex justify-center">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
          
        </div>
        <div class="text-h5 text-center mb-3">加载中</div>
      </v-container>

    <v-container v-show="view == 1">
      <div class="mt-6 mb-2">
        <div class="text-h5 text-center mb-3">
          <v-icon>mdi-check-circle</v-icon>删除成功
        </div>
      </div>
      <v-row justify="center" class="mt-4">
          <v-btn to="/" class="mx-auto" depressed>重新生成</v-btn>
        </v-row>
    </v-container>

    <v-container v-show="view == -1">
      <div class="mt-6 mb-2">
        <div class="text-h5 text-center mb-3">
          <v-icon>mdi-alert-circle</v-icon>删除失败
        </div>
      </div>
      <v-row justify="center" class="mt-4">
          <v-btn to="/" class="mx-auto" depressed>重新生成</v-btn>
        </v-row>
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
  </div>
</template>

<script>
export default {
  name: "delete",
  data: function () {
    return {
      view: 0,
      config: {
        alert_text: "",
        alert_type: "info",
        alert: false,
      },
    };
  },
  mounted: function () {
    var _this = this;
    this.axios({
      url:
        "/api/" +
        this.$route.params.token +
        "/" +
        this.$route.params.key +
        "/delete",
      method: "post",
    })
      .then((res) => {
        if (res.data.status == 0) {
          _this.view = 1;
        } else {
          _this.view = -1;
          _this.error(res.data.msg);
        }
      })
      .catch((err) => {
        _this.error(err);
      });
  },
  methods: {
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
