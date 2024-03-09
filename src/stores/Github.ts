import { Octokit } from "octokit";
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useMarkdownStore } from "./Markdown";
import router from "@/router";


const m = useMarkdownStore()

export const useGithubStore = defineStore('Github', () => {

    const octokit = new Octokit({
        baseUrl:"https://api.github.com",
    })

    const Github = ref({
        owner:"RedCrazyGhost",
        repo:"blog",
      })

    
      async function GetIssue(id:number){
        m.GetMarkdowns.forEach((mData) => {
          if(mData.number === id){
            m.SetCurrentMarkdown(mData)  
            return
          }
        })

        if(m.GetCurrentMarkdown!= null && m.GetCurrentMarkdown.number === id) return

       await octokit.rest.issues.get({
          owner: Github.value.owner,
          repo: Github.value.repo,
          issue_number:id
        }).then(res => {
          m.AddMarkdown(res.data)
          m.SetCurrentMarkdown(res.data)
        }).catch(() => {  
          router.push({name:"404"})
        })
      }


      async function GetIssues(){
        await octokit.rest.issues.listForRepo({
            owner: Github.value.owner,
            repo: Github.value.repo,
            creator: Github.value.owner,
            state: 'open',
            per_page: 10,
            page:1
        }).then(res => {
          res.data.forEach((mData) => {
            m.AddMarkdown(mData)
          })
        })

    }

      const GetGithubRepo = computed(() => {
        return Github.value.repo
      })
    
      const GetGithubOwner = computed(() => {
        return Github.value.owner
      })
      return {
        GetGithubRepo,GetGithubOwner,GetIssues,GetIssue
      }
})

