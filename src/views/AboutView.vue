<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <section class="about-profile mb-12">
      <h2 class="text-lg font-semibold mb-4">个人信息</h2>
      <div class="profile-card rounded-xl border-2 p-6">
        <div
          class="flex flex-col sm:flex-row items-center sm:items-start gap-4"
        >
          <img
            v-if="config.app.author.avatar"
            :src="config.app.author.avatar"
            :alt="config.app.author.name"
            class="w-20 h-20 rounded-full object-cover flex-shrink-0"
          />
          <div class="flex-1 text-center sm:text-left min-w-0">
            <p class="font-medium text-lg">{{ config.app.author.name }}</p>
            <p
              v-if="config.app.author.bio"
              class="text-sm mt-2 opacity-90 whitespace-pre-wrap"
            >
              {{ config.app.author.bio }}
            </p>
            <ul
              v-if="config.app.author.links?.length"
              class="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start"
            >
              <li v-for="(link, i) in config.app.author.links" :key="i">
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm opacity-90 hover:opacity-100 underline"
                >
                  <font-awesome-icon
                    v-if="link.icon"
                    :icon="link.icon"
                    class="opacity-90"
                    size="1x"
                  />
                  <span>{{ link.label }}</span>
                </a>
              </li>
            </ul>

            <div v-if="skills.length" class="mt-4">
              <span class="block text-sm font-semibold mb-2">个人能力</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(s, i) in skills"
                  :key="i"
                  class="rounded-full border px-2 py-0.5 text-xs opacity-90"
                >
                  {{ s }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-life mb-12">
      <h2 class="text-lg font-semibold mb-6">人生经历</h2>
      <VerticalTimeline :items="lifeItems" />
    </section>
  </div>
</template>

<script setup lang="ts">
import VerticalTimeline from "@/components/common/VerticalTimeline.vue";
import type { TimelineItem } from "@/types/timeline";
import { config } from "@/config";

const skills: string[] = [
  "Go 基础（Slice/Map/Channel/Goroutine/锁）",
  "Gin、GORM",
  "网络基础（HTTP/TCP/IP）",
  "数据结构与算法",
  "MySQL（InnoDB/索引/事务）",
  "Redis（数据结构/缓存一致性）",
  "Git + CI/CD",
  "Docker",
  "Linux + 云平台",
  "AI 辅助开发（Cursor/OpenSpec）",
];

const workItems: TimelineItem[] = [
  {
    title: "上海西井科技股份有限公司 · Golang 开发工程师（外包）",
    startDate: "2024-03",
    endDate: "2026-03",
    description:
      "2024年03月 - 2026年03月（AdaOps / AdaOps Simulator / Management Plane）",
    responsibilities: [
      "从零到一全程参与后端核心模块的设计与实现（车辆数据模型、去重与口径对齐等）",
      "负责车辆远程控制指令交互，完成远程脱困模式全流程交互，降低现场人工拖车耗时",
      "负责车辆数据报表聚合设计与实现（车辆/补能任务/充电桩），提升数据可靠性与决策正确性",
      "对 WebSocket 推送数据进行迭代去重、定频推送、数据瘦身，并将压测处理能力从 50 台提升到 200+ 台",
      "使用 Cursor + OpenSpec 提升开发效率：将工作量从 3 天压缩到 2 天，并可输出与代码高度一致的技术文档",
      "承担现场部署与问题排查修复，累计解决 400+ Jira 问题，并参与部分客户定制化开发",
    ],
    deliverables: [
      "AdaOps 截止 2026 年已在全球 40+ 项目场地上线服务，累计超过 300 辆自行研制自动驾驶车辆",
      "运营期间支持完成超过 1 万个标准集装箱；人工介入率从 1%+ 下降到 0.3%",
    ],
  },
  {
    title: "杭州迪萌科技有限公司 · Golang 开发工程师",
    startDate: "2023-12",
    endDate: "2024-02",
    description: "2023年12月 - 2024年02月（UIPaaS Tables）",
    responsibilities: [
      "负责 Tables 模块技术调研、方案制定与代码实现全流程",
      "完成现有存储方案对比，制定表结构元数据存储规范",
      "实现数据库存储类型下的动态字段语义化交互接口，完成基础功能闭环",
    ],
    deliverables: [
      "完成 Tables 模块从调研到闭环交付，支持用户自定义数据模型能力落地",
    ],
  },
  {
    title: "上海卓豪管理咨询有限公司 · Golang 开发工程师（实习）",
    startDate: "2022-06",
    endDate: "2022-12",
    description: "2022年06月 - 2022年12月（小米 / 上海医药 / 壹药网）",
    responsibilities: [
      "针对小米 1000+ 台服务器信息：使用 Golang 访问 MySQL，并通过 Zoho API 落库到 ServiceDesk Plus 系统",
      "针对上海医药 500+ 台终端设备：使用 SNMP 获取硬件参数，格式化并消除乱码后录入 Zoho API",
      "针对壹药网 1800+ 名员工资产核验：基于 SMTP 开发邮件分发软件，通过 Zoho API 获取数据并按模板发送核验邮件",
    ],
    deliverables: [
      "支撑多场景资产/设备信息的批量采集、格式化与自动录入/通知流程",
    ],
  },
];

const projectItems: TimelineItem[] = [
  {
    title: "AdaOps（车队运营平台）",
    startDate: "2024-10",
    endDate: "2026-03",
    description:
      "负责车队运营核心能力：车辆数据处理、远程控制、通知、脱困模式、作业任务适配与充电/报表等。",
    // 复用时间线的“工作产出”列表样式承载项目亮点
    deliverables: [
      "维护不同车型的 MQTT 消息处理：去重与口径对齐，确保后续使用的数据真实可靠",
      "对外推送采用去重与定频推送，保证前端数据处理不过度滞后",
      "通过 MQTT 下发各类指令，完成车辆远程控制操作",
      "设计应用内通知模块：以设备类型+ID 作为 Key，结合通知类型+自定义内容作为 Field 实现去重；支持故障码悬挂等可定制逻辑",
      "实现车辆脱困模式：上层指令与唯一控制人处理，下层通过 MQTT 做状态切换与交互；利用 Redis 融合请求与上报状态完成生命周期闭环",
      "适配车辆作业任务显示：梳理 TOS 与车辆任务交互流程，区分长任务头与短任务执行内容，并完成联动构建",
      "完成充电模块初始设计：编排充电桩与充电位逻辑，接入外部厂商协议；倒排排程算法按电池容量与功率调度",
      "实现车辆数据报表聚合：单车日产生 2.8 万条数据，日聚合量级 10 万到百万；通过游标逐条聚合存储，支撑稳定的报表输出",
    ],
  },
  {
    title: "AdaOps Simulator（补能仿真平台）",
    startDate: "2025-06",
    endDate: "2026-03",
    description: "从零到一实现仿真平台与补能模块算法验证。",
    deliverables: [
      "通过 WebSocket 与 MQTT 与补能模块进行车辆/换电站状态行为数据交互",
      "车辆/换电站分别拥有状态机与 topic 协程池：解耦并避免全局时间速率影响",
      "使用队列调度换电任务响应，按先进先出原则完成换电流程模拟",
      "一台 180Kwh 充电桩可服务 12 辆 280Kwh 车辆；一个换电站可支持 13 辆多电池容量换电与多参数仿真论证",
    ],
  },
  {
    title: "Management Plane（车载/场端管理应用）",
    startDate: "2024-03",
    endDate: "2024-10",
    description:
      "负责管理平面核心服务开发与维护：接口权限、观测性、生命周期管理与数据回传等。",
    deliverables: [
      "设计实现基于 HTTP 头（X-RBAC-ROLE / X-RBAC-NAME）的 RBAC 校验、命令白名单与通配规则，保障敏感接口访问控制",
      "统一 TraceID，请求日志与 Client ID 关联，支撑问题定位与审计",
      "管理 Well Pilot 启停与生命周期：从车辆 shell 脚本管理迁移到管理平面",
      "适配多车型激光雷达标定功能，并回传标定数据支持人为校准",
      "参与 QFile 录制数据回传处理：文件名按时间范围与 Topic 过滤、跨天遍历、目录 DFS，迭代提升回传能力",
    ],
  },
];

const educationItems: TimelineItem[] = [
  {
    title: "湖北师范大学",
    startDate: "2021-09",
    endDate: "2023-06",
    description: "本科 · 计算机科学与技术",
    deliverables: ["第十三届蓝桥杯软件类省赛二等奖"],
  },
  {
    title: "湖北轻工职业技术学院",
    startDate: "2018-09",
    endDate: "2021-06",
    description: "大专 · 计算机信息管理",
  },
];

const lifeItems: TimelineItem[] = [
  ...workItems,
  ...projectItems,
  ...educationItems,
];
</script>
