package com.finsight.lab.config;

import com.finsight.lab.util.MyBatisUtils;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import javax.sql.DataSource;

@Configuration
public class MyBatisConfig {

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
        sessionFactoryBean.setDataSource(dataSource);

        // Explicitly set the mapper locations
        sessionFactoryBean.setMapperLocations(
            new PathMatchingResourcePatternResolver().getResources("classpath:/com/finsight/lab/mapper/**/*.xml")
        );

        // Create the SqlSessionFactory
        SqlSessionFactory sqlSessionFactory = sessionFactoryBean.getObject();

        // Initialize MyBatisUtils with the created SqlSessionFactory
        MyBatisUtils.setSqlSessionFactory(sqlSessionFactory);

        return sqlSessionFactory;
    }
}
