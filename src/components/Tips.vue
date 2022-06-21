<template>
  <dir>
    <v-row justify="center">
      <v-dialog
        v-model="showTips"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="close()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>说明文档</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text class="mt-5">
            <v-progress-linear
              indeterminate
              color="primary"
              v-if="loading"
            ></v-progress-linear>
            <div v-html="markdownToHtml"></div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </dir>
</template>

<script>
import { marked } from "marked";
export default {
  name: "tips",
  props: ["show"],
  data() {
    return {
      showTips: false,
      markdown: "### 获取中。。。",
      loading: true,
    };
  },
  methods: {
    close() {
      this.showTips = false;
    },
    getMD: function () {
      this.axios({
        url: "/api/tips",
        method: "get",
      })
        .then((res) => {
          if (res.data.status == 0) {
            this.markdown = res.data.data;
          } else {
            this.error(res.data.msg);
          }
          this.loading = false;
        })
        .catch((err) => {
          this.error(err);
        });
    },
    error: function (text){
      this.loading = false
      this.markdown = "# 读取失败("+ text+")"
    },
  },
  computed: {
    markdownToHtml() {
      return marked.parse(this.markdown);
    },
  },
  watch: {
    show() {
      this.showTips = this.show;
    },
    showTips(n) {
      if (n == false) {
        this.$emit("close");
      } else {
        //打开时初始化数据
        this.getMD();
      }
    },
  },
};
</script>

<style></style>
