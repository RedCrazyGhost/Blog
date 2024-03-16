import { Octokit } from "octokit";
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMarkdownStore } from "./Markdown";
import router from "@/router";

const m = useMarkdownStore();

export const useGithubStore = defineStore("Github", () => {
  const octokit = new Octokit({
    baseUrl: "https://api.github.com",
  });

  const Github = ref({
    owner: "RedCrazyGhost",
    repo: "blog",
  });

  const pageConfig = ref({
    haveNext: true,
    currentPage: 1,
  });

  async function GetIssue(id: number) {
    m.GetMarkdowns.forEach((mData) => {
      if (mData.number === id) {
        m.SetCurrentMarkdown(mData);
        return;
      }
    });

    if (m.GetCurrentMarkdown != null && m.GetCurrentMarkdown.number === id)
      return;

    await octokit.rest.issues.get({
        owner: Github.value.owner,
        repo: Github.value.repo,
        issue_number: id,
      }).then((res) => {
        console.log(res);
        m.AddMarkdown(res.data);
        m.SetCurrentMarkdown(res.data);
      }).catch(error => {
        console.log(error);
        router.push({ name: "404" });
      });

  }

  async function GetIssues() {
    if (pageConfig.value.haveNext === false) return;
    await octokit.rest.issues
      .listForRepo({
        owner: Github.value.owner,
        repo: Github.value.repo,
        creator: Github.value.owner,
        state: "open",
        per_page: 10,
        page: pageConfig.value.currentPage,
      })
      .then((res) => {
        console.log(res);
        res.data.forEach((mData) => {
          m.AddMarkdown(mData);
        });
        if (res.data.length < 10) {
          pageConfig.value.haveNext = false;
        }
        pageConfig.value.currentPage += 1;
      })
      .catch((err) => {
        console.log(err);
        pageConfig.value.haveNext = false;
      })


      // 存在无法赋值 haveNext
  }

  const GetGithubRepo = computed(() => {
    return Github.value.repo;
  });

  const GetGithubOwner = computed(() => {
    return Github.value.owner;
  });
  return {
    GetGithubRepo,
    GetGithubOwner,
    GetIssues,
    GetIssue,
  };
});
