# SSM框架配置
> 作者 : RedCrazyGhost
> 创建时间 : 2022-04-14
> 修改时间 : 2022-04-23
> 标签 :  <span class="badge bg-secondary">Mac OS</span> <span class="badge rounded-pill bg-success">Spring</span> <span class="badge rounded-pill bg-success">Spring MVC</span> <span class="badge rounded-pill bg-success">MyBatis</span> <span class="badge bg-primary">Java</span> 

Maven POM.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>ghost</groupId>
    <artifactId>ssm</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <springframework-version>5.2.21.RELEASE</springframework-version>
        <log4j-version>2.17.2</log4j-version>
        <druid-version>1.2.8</druid-version>
        <mysql-version>8.0.28</mysql-version>
        <mybatis-veriosn>3.5.9</mybatis-veriosn>
        <mybatis-spring-version>2.0.7</mybatis-spring-version>
        <lombok-version>1.18.22</lombok-version>
        <aspectj-version>1.9.9.1</aspectj-version>
        <cglib-version>3.3.0</cglib-version>
        <junit-version>5.8.2</junit-version>
        <fastjson-verions>1.2.80</fastjson-verions>
    </properties>


    <dependencies>

        <!--alibaba json 解析-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>${fastjson-verions}</version>
        </dependency>

        <!--单元测试-->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>${junit-version}</version>
            <scope>test</scope>
        </dependency>

        <!--aop 代理-->
        <dependency>
            <groupId>cglib</groupId>
            <artifactId>cglib</artifactId>
            <version>${cglib-version}</version>
        </dependency>

        <!--aop 注解-->
        <!--1.9.9.1 没有@Aspect-->
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>${aspectj-version}</version>
        </dependency>

        <!--注解 自动生成常用方法-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok-version}</version>
            <scope>provided</scope>
        </dependency>

        <!--SpringMVC依赖-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${springframework-version}</version>
        </dependency>

        <!--log4j日志框架-->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>${log4j-version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>${log4j-version}</version>
        </dependency>

        <!--Java MySQL 连接驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql-version}</version>
        </dependency>

        <!--alibaba druid 数据库连接池-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid-version}</version>
        </dependency>

        <!--Spring-JDBC框架-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${springframework-version}</version>
        </dependency>

        <!--Mybatis 数据库框架-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis-veriosn}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>${mybatis-spring-version}</version>
        </dependency>

    </dependencies>

</project>
```


```mermaid
graph LR
    subgraph Maven Project
    web[web.xml]
    subgraph Spring
    application[application.xml]
    end
    subgraph SpringMVC
    spring-mvc[spring-mvc.xml]
    end
    subgraph webapp
        web-->application
        web-->spring-mvc
    end
    end
```

Webapp web.xml
```mermaid
graph LR
subgraph 节点加载顺序
   context-param --> listener --> filter --> servlet
end
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                  http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--WEB 应用名称-->
    <display-name>ssm</display-name>

    <!--WEB 应用描述-->
    <description>Spring+SpringMVC+Mybatis Web应用</description>
    
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:/application.xml</param-value>
    </context-param>

    <!--开启监听-->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!--Servlet 容器设置-->
    <servlet>
        <servlet-name>app</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>app</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!--过滤器配置-->
    <!--
        修改 tomcat server.xml 配置 添加URIEncoding
        <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443"
               URIEncoding="UTF-8"
               />
        也无法生效！
     -->
    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--会话设置-->
    <session-config>
        <cookie-config>
            <name>MyConfig</name>
            <!--cookie 有效时长 (单位：秒)-->
            <max-age>600</max-age>
        </cookie-config>
        <!--session 有效时长 (单位:分钟)-->
        <session-timeout>120</session-timeout>
    </session-config>

    <!--首页-->
    <welcome-file-list>
        <welcome-file>/WEB-INF/index.html</welcome-file>
    </welcome-file-list>

    <!--错误页面-->
    <error-page>
        <exception-type>java.lang.Exception</exception-type>
        <location>/WEB-INF/error.html</location>
    </error-page>

</web-app>
```

spring配置 application.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context" xmlns:p="http://www.springframework.org/schema/p"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd"
>
    <!--扫描除Controller层外的所有层-->
    <context:component-scan base-package="ghost">
        <!--排除controller层-->
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!--获取jdbc配置数据-->
    <context:property-placeholder location="classpath:/jdbc.properties" />

    <!--dataSource 配置 (alibaba druid)-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close"
          p:url="${jdbc.url}"
          p:username="${jdbc.username}"
          p:password="${jdbc.password}"
    />

    <!--配置sqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean"
          p:dataSource-ref="dataSource"
          p:configLocation="classpath:/mybatis-config.xml"
          p:typeAliasesPackage="ghost.pojo"
          p:mapperLocations="classpath:/mappers/*.xml"
    />

    <!--配置MapperScanner扫描Dao层-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer"
          p:basePackage="ghost.dao"
    />

    <!--开启注解@Aspect-->
    <aop:aspectj-autoproxy/>

</beans>
```

SpringMVC配置 spring-mvc.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc" xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc https://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!--扫描Controller 层-->
    <context:component-scan base-package="ghost.controller"/>

    <!--开启注解-->
    <mvc:annotation-driven>
        <!--修改默认编码-->
        <mvc:message-converters register-defaults="true">
            <bean class="org.springframework.http.converter.StringHttpMessageConverter">
                <constructor-arg value="UTF-8" />
            </bean>
        </mvc:message-converters>
    </mvc:annotation-driven>

    <!--静态资源-->
    <mvc:resources mapping="/CSS/**" location="/WEB-INF/CSS/"/>
    <mvc:resources mapping="/JS/**" location="/WEB-INF/JS/"/>
    <mvc:resources mapping="/IMAG/**" location="/WEB-INF/IMAG/"/>
    <mvc:resources mapping="/TTF/**" location="/WEB-INF/TTF/"/>

    <!--使用MVC默认拦截器-->
    <mvc:default-servlet-handler/>

    <!--配置InternalResourceViewResolver-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"
          p:prefix="/WEB-INF/views/"
          p:suffix=".html"
    />

</beans>
```

mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="logImpl" value="LOG4J2"/>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
</configuration>
```

log4j2.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Appenders>
        <!-- 默认打印到控制台 -->
        <Console name="Console" target="SYSTEM_OUT">
            <!-- 默认打印格式 -->
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>
    <Loggers>
        <!-- 默认打印日志级别为 error -->
        <Root level="debug">
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```

jdbc.properties
因为使用alibaba druid可以不写drive
```properties
jdbc.url=jdbc:mysql://localhost:3306/database
jdbc.username=username
jdbc.password=password
```