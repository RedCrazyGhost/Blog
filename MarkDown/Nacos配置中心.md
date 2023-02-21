# Nacos配置中心
> 作者 : RedCrazyGhost
> 创建时间 : 2022-05-04
> 修改时间 : 2022-05-04
> 阅读时长 : 5分钟
> 标签 :  <span class="badge rounded-pill bg-success">Spring Cloud Alibaba</span> <span class="badge bg-primary">Java</span> 
### 前置的条件
启动<kbd>[Nacos Server](https://nacos.io/zh-cn/docs/quick-start.html)</kbd>
导入<kbd>[spring-cloud-starter-bootstrap](https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-bootstrap)</kbd>和<kbd>[spring-cloud-starter-alibaba-nacos-config](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-config)</kbd>

<kbd>bootstrap(.yml/.properties)</kbd>由父Spring ApplicationContext加载，用于程序的上下文引导阶段
<kbd>application(.yml/.properties)</kbd>在由父Spring ApplicationContext加载之后，用于程序

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

### dataId

>${prefix}-${spring.profiles.active}.${file-extension}

> <kbd>prefix</kbd> 默认值为<kbd>spring.application.name</kbd> 也可以通过配置<kbd>spring.cloud.nacos.config.prefix</kbd> 来配置
> <kbd>spring.profiles.active</kbd> 默认值为<kbd>空</kbd> 也可以通过<kbd>spring.profiles.active</kbd> 来配置
> <kbd>file-extension</kbd> 默认值为<kbd>properties</kbd> 通过<kbd>spring.cloud.nacos.config.file-extension</kbd> 来配置


举个栗子：
**bootstrap.yml file**
```yml
server:
  port: 9000
spring:
  application:
    name: Web
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.1:8848
        file-extension: yaml
        namespace: public
        group: DEFAULT_GROUP
  profiles:
    active: dev
```
|dataId|namespace|Group|active|
|:-:|:-:|:-:|:-:|
|Web-dev.yaml|public|DEFAULT_GROUP|dev|

### 解决问题
正确配置即可解决问题！要有耐心啦，很简单的啦！
```Java
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'scopedTarget.configController': Injection of autowired dependencies failed; nested exception is java.lang.IllegalArgumentException: Could not resolve placeholder 'XXX' in value "${XXX}"
```

