    create table achievements (
        id int unsigned not null auto_increment,
        runId bigint null,
        workgroupId bigint null,
        achievementId varchar(255) not null,
        achievementData text not null,
        achievementTime datetime not null,
        primary key (id),
        index runIdIndex (runId),
        index workgroupIdIndex (workgroupId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table acl_class (
        id bigint not null auto_increment,
        class varchar(255) not null,
        OPTLOCK integer,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table acl_entry (
        id bigint not null auto_increment,
        ace_order integer not null,
        audit_failure bit not null,
        audit_success bit not null,
        granting bit not null,
        mask integer not null,
        OPTLOCK integer,
        sid bigint not null,
        acl_object_identity bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table acl_object_identity (
        id bigint not null auto_increment,
        object_id_identity bigint not null,
        object_id_identity_num integer,
        entries_inheriting bit not null,
        OPTLOCK integer,
        object_id_class bigint not null,
        owner_sid bigint,
        parent_object bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table acl_sid (
        id bigint not null auto_increment,
        principal boolean not null,
        sid varchar(255) not null,
        OPTLOCK integer,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table annotation (
        id bigint not null auto_increment,
        annotateTime datetime,
        data mediumtext,
        nodeId varchar(255),
        postTime datetime,
        runId bigint,
        type varchar(255),
        fromUser_id bigint,
        stepWork_id bigint,
        toUser_id bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table annotations (
        id integer not null auto_increment,
        clientSaveTime datetime not null,
        componentId varchar(30),
        data text not null,
        nodeId varchar(30),
        serverSaveTime datetime not null,
        type varchar(30) not null,
        fromWorkgroupId bigint,
        periodId bigint not null,
        runId bigint not null,
        studentWorkId integer,
        localNotebookItemId varchar(30),
        notebookItemId integer,
        toWorkgroupId bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table announcements (
        id mediumint not null auto_increment,
        announcement mediumtext not null,
        timestamp datetime not null,
        title varchar(255) not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table craterrequest (
        id bigint not null auto_increment,
        cRaterItemId varchar(255) not null,
        cRaterItemType varchar(255),
        cRaterResponse text,
        failCount integer,
        nodeStateId bigint not null,
        runId bigint not null,
        timeCompleted datetime,
        timeCreated datetime,
        stepWorkId bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table events (
        id integer not null auto_increment,
        category varchar(255) not null,
        clientSaveTime datetime not null,
        componentId varchar(30),
        componentType varchar(30),
        context varchar(30) not null,
        data text,
        event varchar(255) not null,
        nodeId varchar(30),
        serverSaveTime datetime not null,
        periodId bigint,
        runId bigint not null,
        workgroupId bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table granted_authorities (
        id bigint not null auto_increment,
        authority varchar(255) not null,
        OPTLOCK integer,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table groups (
        id bigint not null auto_increment,
        name varchar(255) not null,
        OPTLOCK integer,
        parent_fk bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table groups_related_to_users (
        group_fk bigint not null,
        user_fk bigint not null,
        primary key (group_fk, user_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table ideabasket (
        id bigint not null auto_increment,
        action varchar(255),
        actionPerformer bigint,
        data mediumtext,
        ideaId bigint,
        ideaWorkgroupId bigint,
        isPublic bit,
        periodId bigint,
        postTime datetime,
        projectId bigint,
        runId bigint,
        workgroupId bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table newsitem (
        id integer not null auto_increment,
        date datetime not null,
        news text not null,
        title varchar(255) not null,
        type varchar(255) not null,
        owner bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table node (
        id bigint not null auto_increment,
        nodeId varchar(255),
        nodeType varchar(255),
        runId varchar(255),
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table notebookItems (
        id integer not null auto_increment,
        clientDeleteTime datetime,
        clientSaveTime datetime not null,
        componentId varchar(30),
        content text,
        localNotebookItemId varchar(30),
        nodeId varchar(30),
        serverDeleteTime datetime,
        serverSaveTime datetime not null,
        title varchar(255),
        type varchar(30),
        periodId bigint not null,
        runId bigint not null,
        studentAssetId integer,
        studentWorkId integer,
        workgroupId bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table notification (
        id integer not null auto_increment,
        componentId varchar(30),
        componentType varchar(30),
        data mediumtext,
        message varchar(255) not null,
        groupId varchar(30),
        nodeId varchar(30),
        serverSaveTime datetime not null,
        timeDismissed datetime,
        timeGenerated datetime not null,
        type varchar(255),
        fromWorkgroupId bigint,
        periodId bigint not null,
        runId bigint not null,
        toWorkgroupId bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table offerings (
        id bigint not null auto_increment,
        OPTLOCK integer,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table peerreviewgate (
        id bigint not null auto_increment,
        open bit,
        periodId bigint,
        runId bigint,
        node_id bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table peerreviewwork (
        id bigint not null auto_increment,
        periodId bigint,
        runId bigint,
        annotation_id bigint,
        node_id bigint,
        reviewerUserInfo_id bigint,
        stepWork_id bigint,
        userInfo_id bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table portal (
        id tinyint not null auto_increment,
        address varchar(255),
        comments varchar(255),
        google_map_key varchar(255),
        sendmail_on_exception bit,
        portalname varchar(255),
        projectMetadataSettings text,
        run_survey_template text,
        sendmail_properties tinyblob,
        settings text,
        OPTLOCK integer,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table portal_statistics (
        id smallint unsigned not null auto_increment,
        timestamp datetime,
        totalNumberProjects bigint,
        totalNumberProjectsRun bigint,
        totalNumberRuns bigint,
        totalNumberStudentLogins bigint,
        totalNumberStudents bigint,
        totalNumberTeacherLogins bigint,
        totalNumberTeachers bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table portfolio (
        id bigint not null auto_increment,
        deletedItems mediumtext,
        isPublic bit,
        isSubmitted bit,
        items mediumtext,
        metadata mediumtext,
        postTime datetime,
        runId bigint,
        tags varchar(255),
        workgroupId bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table premadecommentlists (
        id bigint not null auto_increment,
        global bit,
        label varchar(255) not null,
        projectId bigint,
        owner bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table premadecomments (
        id bigint not null auto_increment,
        comment varchar(255) not null,
        labels varchar(255),
        listposition bigint,
        owner bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table premadecomments_related_to_premadecommentlists (
        premadecommentslist_fk bigint not null,
        premadecomments_fk bigint not null,
        primary key (premadecommentslist_fk, premadecomments_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table projects (
        id bigint not null auto_increment,
        datecreated datetime not null,
        dateDeleted datetime,
        familytag integer,
        iscurrent bit,
        isDeleted bit,
        ispublic bit,
        maxTotalAssetsSize bigint,
        name varchar(255) not null,
        modulePath varchar(255) not null,
        parentprojectid bigint,
        projecttype integer,
        OPTLOCK integer,
        wiseVersion integer,
        metadata_fk bigint,
        metadata mediumtext,
        owner_fk bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table projects_related_to_bookmarkers (
        projects_fk bigint not null,
        bookmarkers bigint not null,
        primary key (projects_fk, bookmarkers)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table projects_related_to_shared_owners (
        projects_fk bigint not null,
        shared_owners_fk bigint not null,
        primary key (projects_fk, shared_owners_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table projects_related_to_tags (
        project_fk bigint not null,
        tag_fk integer not null,
        primary key (project_fk, tag_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table runs (
        archive_reminder datetime not null,
        end_time datetime,
        extras mediumtext,
        info varchar(255),
        lastRun datetime,
        loggingLevel integer,
        maxWorkgroupSize integer,
        name varchar(255),
        postLevel integer not null,
        private_notes text,
        run_code varchar(255) not null,
        start_time datetime not null,
        survey text,
        timesRun integer,
        versionId varchar(255),
        id bigint not null,
        owner_fk bigint not null,
        project_fk bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table runs_related_to_announcements (
        runs_fk bigint not null,
        announcements_fk mediumint not null,
        primary key (runs_fk, announcements_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table runs_related_to_groups (
        runs_fk bigint not null,
        groups_fk bigint not null,
        primary key (runs_fk, groups_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table runs_related_to_shared_owners (
        runs_fk bigint not null,
        shared_owners_fk bigint not null,
        primary key (runs_fk, shared_owners_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table runstatus (
        id bigint not null auto_increment,
        runId bigint,
        status mediumtext,
        timestamp datetime,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table stepwork (
        id bigint not null auto_increment,
        data mediumtext not null,
        endTime datetime,
        postTime datetime not null,
        startTime datetime,
        node_id bigint not null,
        userInfo_id bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table studentAssets (
        id integer not null auto_increment,
        clientDeleteTime datetime,
        clientSaveTime datetime not null,
        componentId varchar(30),
        componentType varchar(30),
        fileName varchar(255) not null,
        filePath varchar(255) not null,
        fileSize bigint not null,
        isReferenced bit not null,
        nodeId varchar(30),
        serverDeleteTime datetime,
        serverSaveTime datetime not null,
        periodId bigint not null,
        runId bigint not null,
        workgroupId bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table studentWork (
        id integer not null auto_increment,
        clientSaveTime datetime not null,
        componentId varchar(30),
        componentType varchar(30),
        isAutoSave bit not null,
        isSubmit bit not null,
        nodeId varchar(30) not null,
        serverSaveTime datetime not null,
        studentData mediumtext not null,
        periodId bigint not null,
        runId bigint not null,
        workgroupId bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table student_attendance (
        id int unsigned not null auto_increment,
        absentUserIds varchar(255),
        loginTimestamp datetime,
        presentUserIds varchar(255),
        runId bigint,
        workgroupId bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table student_user_details (
        accountanswer varchar(255) not null,
        accountquestion varchar(255) not null,
        birthday datetime not null,
        firstname varchar(255) not null,
        gender integer not null,
        lastlogintime datetime,
        lastname varchar(255) not null,
        numberoflogins integer not null,
        signupdate datetime not null,
        id bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table studentstatus (
        id bigint not null auto_increment,
        periodId bigint,
        runId bigint,
        status mediumtext,
        timestamp datetime,
        workgroupId bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table tags (
        id integer not null auto_increment,
        name varchar(255),
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table teacher_user_details (
        city varchar(255),
        country varchar(255) not null,
        curriculumsubjects tinyblob,
        displayname varchar(255),
        isEmailValid bit not null,
        firstname varchar(255) not null,
        howDidYouHearAboutUs varchar(255),
        lastlogintime datetime,
        lastname varchar(255) not null,
        numberoflogins integer not null,
        schoollevel integer not null,
        schoolname varchar(255) not null,
        signupdate datetime not null,
        state varchar(255),
        id bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table user_details (
        id bigint not null auto_increment,
        account_not_expired bit not null,
        account_not_locked bit not null,
        credentials_not_expired bit not null,
        email_address varchar(255),
        enabled bit not null,
        language varchar(255),
        recent_number_of_failed_login_attempts integer,
        password varchar(255) not null,
        recent_failed_login_time datetime,
        reset_password_key varchar(255),
        reset_password_request_time datetime,
        username varchar(255) not null,
        OPTLOCK integer,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table user_details_related_to_roles (
        user_details_fk bigint not null,
        granted_authorities_fk bigint not null,
        primary key (user_details_fk, granted_authorities_fk)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table userinfo (
        id bigint not null auto_increment,
        workgroupId bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table users (
        id bigint not null auto_increment,
        OPTLOCK integer,
        user_details_fk bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table vle_statistics (
        id bigint not null auto_increment,
        data text,
        timestamp datetime,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table wiseworkgroups (
        externalId bigint,
        is_teacher_workgroup bit,
        id bigint not null,
        period bigint,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    create table workgroups (
        id bigint not null auto_increment,
        OPTLOCK integer,
        group_fk bigint not null,
        offering_fk bigint not null,
        primary key (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    alter table acl_class
        add constraint UK_iy7ua5fso3il3u3ymoc4uf35w  unique (class);

    alter table acl_entry
        add constraint UK_gh5egfpe4gaqokya6s0567b0l  unique (acl_object_identity, ace_order);

    alter table acl_object_identity
        add constraint UK_ehrgv7ffpt0jenafv0o1bu5tm  unique (object_id_class, object_id_identity);

    alter table acl_sid
        add constraint UK_meabypi3cnm8604op6qvd517v  unique (sid, principal);

    create index annotationsRunIdIndex on annotations (runId);

    create index annotationsToWorkgroupIdIndex on annotations (toWorkgroupId);

    create index eventsRunIdIndex on events (runId);

    create index eventsWorkgroupIdIndex on events (workgroupId);

    alter table granted_authorities
        add constraint UK_cgffgw24ojv4o1oe9cpgdy60k  unique (authority);

    create index ideabasketRunIdAndWorkgroupIdIndex on ideabasket (runId, workgroupId);

    create index nodeRunIdIndex on node (runId);

    create index notebookItemsRunIdIndex on notebookItems (runId);

    create index notebookItemsWorkgroupIdIndex on notebookItems (workgroupId);

    create index notificationRunIdIndex on notification (runId);

    create index notificationToWorkgroupIdIndex on notification (toWorkgroupId);

    create index notificationFromWorkgroupIdIndex on notification (fromWorkgroupId);

    create index portfolioRunIdAndWorkgroupIdIndex on portfolio (runId, workgroupId);

    alter table runs
        add constraint UK_dxea1ifhea203qe2ie4lsd8vb  unique (run_code);

    alter table runs_related_to_announcements
        add constraint UK_5wvxgfc1e0xwlprdhcycju191  unique (announcements_fk);

    alter table runs_related_to_groups
        add constraint UK_kcgmq40wsaa12f22mebooiyfv  unique (groups_fk);

    create index runstatusRunIdIndex on runstatus (runId);

    create index studentAssetsRunIdIndex on studentAssets (runId);

    create index studentAssetsWorkgroupIdIndex on studentAssets (workgroupId);

    create index studentWorkRunIdIndex on studentWork (runId);

    create index studentWorkWorkgroupIdIndex on studentWork (workgroupId);

    create index studentstatusRunIdIndex on studentstatus (runId);

    create index studentstatusWorkgroupIdIndex on studentstatus (workgroupId);

    alter table user_details
        add constraint UK_qqadnciq8gixe1qmxd0rj9cyk  unique (username);

    alter table userinfo
        add constraint UK_dp78k1tuh3whhutek48hts0wy  unique (workgroupId);

    create index userinfoWorkgroupIdIndex on userinfo (workgroupId);

    alter table users
        add constraint UK_ol2kbitd35lc87ddawfhiu9ll  unique (user_details_fk);

    alter table achievements
        add constraint achievements_to_runs_fk
        foreign key (runId)
        references runs (id);

    alter table achievements
        add constraint achievements_to_workgroups_fk
        foreign key (workgroupId)
        references wiseworkgroups (id);

    alter table acl_entry
        add constraint FK_i6xyfccd4y3wlwhgwpo4a9rm1
        foreign key (sid)
        references acl_sid (id);

    alter table acl_entry
        add constraint FK_fhuoesmjef3mrv0gpja4shvcr
        foreign key (acl_object_identity)
        references acl_object_identity (id);

    alter table acl_object_identity
        add constraint FK_6c3ugmk053uy27bk2sred31lf
        foreign key (object_id_class)
        references acl_class (id);

    alter table acl_object_identity
        add constraint FK_nxv5we2ion9fwedbkge7syoc3
        foreign key (owner_sid)
        references acl_sid (id);

    alter table acl_object_identity
        add constraint FK_6oap2k8q5bl33yq3yffrwedhf
        foreign key (parent_object)
        references acl_object_identity (id);

    alter table annotation
        add constraint FK_d46ducyl96kyvs66kqcupm1yo
        foreign key (fromUser_id)
        references userinfo (id);

    alter table annotation
        add constraint FK_j0nvgi7bbyvuscs4demti1wco
        foreign key (stepWork_id)
        references stepwork (id);

    alter table annotation
        add constraint FK_rg9ukck99cs044ofyhohguv8
        foreign key (toUser_id)
        references userinfo (id);

    alter table annotations
        add constraint FK_3uwsbpxbqpqynfwt7oym6p59g
        foreign key (fromWorkgroupId)
        references wiseworkgroups (id);

    alter table annotations
        add constraint FK_k3bkb9frmuj637vfehvmnrdqo
        foreign key (periodId)
        references groups (id);

    alter table annotations
        add constraint FK_qoauslcyxtauxtlgeipbsxj1n
        foreign key (runId)
        references runs (id);

    alter table annotations
        add constraint FK_lklpu3fwsovjhx5wqsjlah0ot
        foreign key (studentWorkId)
        references studentWork (id);

    alter table annotations
        add constraint FK_ss22rostrwvgvh4x7n5mmq173
        foreign key (toWorkgroupId)
        references wiseworkgroups (id);

    alter table annotations
        add constraint FK_lklpu3fwsovjhx5wqsjlah0ov
        foreign key (notebookItemId)
        references notebookItems (id);

    alter table craterrequest
        add constraint FK_rx43blmi6te4f1ttt3j1s9vr1
        foreign key (stepWorkId)
        references stepwork (id);

    alter table events
        add constraint FK_hvs65ix9oss3abisglg7r502r
        foreign key (periodId)
        references groups (id);

    alter table events
        add constraint FK_18ony502dcyxdrgjriir0u8bm
        foreign key (runId)
        references runs (id);

    alter table events
        add constraint FK_jh9ptmwgfdnyq9flj9mly66qd
        foreign key (workgroupId)
        references wiseworkgroups (id);

    alter table groups
        add constraint FK_x1sf5l9k6d5g1t7kemday5ib
        foreign key (parent_fk)
        references groups (id);

    alter table groups_related_to_users
        add constraint FK_du79ka4in4vrs0t6fpslc991w
        foreign key (user_fk)
        references users (id);

    alter table groups_related_to_users
        add constraint FK_arb3y3vuj8r7ns7if3cicin5k
        foreign key (group_fk)
        references groups (id);

    alter table newsitem
        add constraint FK_iekdwpu7jkpuwafy4uvocjg3s
        foreign key (owner)
        references users (id);

    alter table notebookItems
        add constraint FK_ise5npapdk8l8oboed1cwdpvy
        foreign key (periodId)
        references groups (id);

    alter table notebookItems
        add constraint FK_ovww8da6he3tajdqcv5kjnkyc
        foreign key (runId)
        references runs (id);

    alter table notebookItems
        add constraint FK_qhj21osipe081frv53u06gsf7
        foreign key (studentAssetId)
        references studentAssets (id);

    alter table notebookItems
        add constraint FK_o7cl4ipb1r8i5golyna3hd3iq
        foreign key (studentWorkId)
        references studentWork (id);

    alter table notebookItems
        add constraint FK_1kysecht20yj67y65kh1n1agw
        foreign key (workgroupId)
        references wiseworkgroups (id);

    alter table notification
        add constraint FK_s2r02d5cb8fx4p7yeoljc4dhp
        foreign key (fromWorkgroupId)
        references wiseworkgroups (id);

    alter table notification
        add constraint FK_ohnbl97r0jjlh6rv4or01ngqu
        foreign key (periodId)
        references groups (id);

    alter table notification
        add constraint FK_7s5o7rba23e06qag9479ohq5w
        foreign key (runId)
        references runs (id);

    alter table notification
        add constraint FK_7opq58yb9g6d4ggs8rg45cdti
        foreign key (toWorkgroupId)
        references wiseworkgroups (id);

    alter table peerreviewgate
        add constraint FK_bulp6tbwu3b9o6eagiq95i2r9
        foreign key (node_id)
        references node (id);

    alter table peerreviewwork
        add constraint FK_ihv9jbfykdl41nyaonh0m2ymg
        foreign key (annotation_id)
        references annotation (id);

    alter table peerreviewwork
        add constraint FK_s4tcwkylkiblmkb0txmtueu01
        foreign key (node_id)
        references node (id);

    alter table peerreviewwork
        add constraint FK_83d9ghow3iirt1fvlu08gyo05
        foreign key (reviewerUserInfo_id)
        references userinfo (id);

    alter table peerreviewwork
        add constraint FK_p6ifyownuo964toju5ryuwg9i
        foreign key (stepWork_id)
        references stepwork (id);

    alter table peerreviewwork
        add constraint FK_9g9bu7b97h9nsjjmxlyfpv3lu
        foreign key (userInfo_id)
        references userinfo (id);

    alter table premadecommentlists
        add constraint FK_6b3n93jbwosh3vltge9l7tech
        foreign key (owner)
        references users (id);

    alter table premadecomments
        add constraint FK_3r3j3qrueilqtvvl5bbpsmj5y
        foreign key (owner)
        references users (id);

    alter table premadecomments_related_to_premadecommentlists
        add constraint FK_86bl25uq177xpco33trwjb7od
        foreign key (premadecomments_fk)
        references premadecomments (id);

    alter table premadecomments_related_to_premadecommentlists
        add constraint FK_3u4rbdp8k8fywqwxobmlexoj
        foreign key (premadecommentslist_fk)
        references premadecommentlists (id);

    alter table projects
        add constraint FK_lglinci94nt1chg4acxpds1nh
        foreign key (owner_fk)
        references users (id);

    alter table projects_related_to_bookmarkers
        add constraint FK_fenusge1cdckorb9yur1o2rh8
        foreign key (bookmarkers)
        references users (id);

    alter table projects_related_to_bookmarkers
        add constraint FK_7hx2irt01trvr794torxcwqsg
        foreign key (projects_fk)
        references projects (id);

    alter table projects_related_to_shared_owners
        add constraint FK_g7j1ver46vlscdpc1yj4whlah
        foreign key (shared_owners_fk)
        references users (id);

    alter table projects_related_to_shared_owners
        add constraint FK_3mfji8oq2i1j2gs1qwrl3trg8
        foreign key (projects_fk)
        references projects (id);

    alter table projects_related_to_tags
        add constraint FK_ewjh3a7iw7rush60sie8rou53
        foreign key (tag_fk)
        references tags (id);

    alter table projects_related_to_tags
        add constraint FK_hfttryi4o1jquauowc5csxxf3
        foreign key (project_fk)
        references projects (id);

    alter table runs
        add constraint FK_rtby4u6ckas8uabbsphui5c3g
        foreign key (owner_fk)
        references users (id);

    alter table runs
        add constraint FK_fipl4dw621w08oghwrx2b23qx
        foreign key (project_fk)
        references projects (id);

    alter table runs
        add constraint FK_99toogxqkbwxwc6o7ah5sv5st
        foreign key (id)
        references offerings (id);

    alter table runs_related_to_announcements
        add constraint FK_5wvxgfc1e0xwlprdhcycju191
        foreign key (announcements_fk)
        references announcements (id);

    alter table runs_related_to_announcements
        add constraint FK_rohbpw2w3diu07k5fpq2rqqf6
        foreign key (runs_fk)
        references runs (id);

    alter table runs_related_to_groups
        add constraint FK_kcgmq40wsaa12f22mebooiyfv
        foreign key (groups_fk)
        references groups (id);

    alter table runs_related_to_groups
        add constraint FK_6ejb2o01s8ck8tanryen4hpbl
        foreign key (runs_fk)
        references runs (id);

    alter table runs_related_to_shared_owners
        add constraint FK_buumthln7k9jh05fr6cceqhn5
        foreign key (shared_owners_fk)
        references users (id);

    alter table runs_related_to_shared_owners
        add constraint FK_jdrsuik03ou6b3oxpwai3tcsy
        foreign key (runs_fk)
        references runs (id);

    alter table stepwork
        add constraint FK_m3n3kdn3kcerb4bl35pc447cn
        foreign key (node_id)
        references node (id);

    alter table stepwork
        add constraint FK_opop9oerhku71x4bsy2y08o16
        foreign key (userInfo_id)
        references userinfo (id);

    alter table studentAssets
        add constraint FK_gkc4jns85mcoslbxsmv4ie439
        foreign key (periodId)
        references groups (id);

    alter table studentAssets
        add constraint FK_rp03jp240sd652ufbuagpk8yr
        foreign key (runId)
        references runs (id);

    alter table studentAssets
        add constraint FK_ek7vyrj5s18xxq7376c4ml182
        foreign key (workgroupId)
        references wiseworkgroups (id);

    alter table studentWork
        add constraint FK_5a5bt8rjamjme0re6qlf7hs1y
        foreign key (periodId)
        references groups (id);

    alter table studentWork
        add constraint FK_hf57jgwp7plk8p935k9engx6v
        foreign key (runId)
        references runs (id);

    alter table studentWork
        add constraint FK_5ojijtumnugj5h36q4g9fi0en
        foreign key (workgroupId)
        references wiseworkgroups (id);

    alter table student_user_details
        add constraint FK_qgv3p8ouoryypy2eacb5ma8xc
        foreign key (id)
        references user_details (id);

    alter table teacher_user_details
        add constraint FK_731ea05n5p0yt79n2xsi93326
        foreign key (id)
        references user_details (id);

    alter table user_details_related_to_roles
        add constraint FK_msgwl9684bgxnfdqbopnf662w
        foreign key (granted_authorities_fk)
        references granted_authorities (id);

    alter table user_details_related_to_roles
        add constraint FK_lwjrxu9hloy65rh3s8s8ol41q
        foreign key (user_details_fk)
        references user_details (id);

    alter table users
        add constraint FK_ol2kbitd35lc87ddawfhiu9ll
        foreign key (user_details_fk)
        references user_details (id);

    alter table wiseworkgroups
        add constraint FK_6uylikvjy2shywbjils4pw5uc
        foreign key (period)
        references groups (id);

    alter table wiseworkgroups
        add constraint FK_f24mfvwckptrwk3kk37q6bnay
        foreign key (id)
        references workgroups (id);

    alter table workgroups
        add constraint FK_l3p60cdyaxu6nxi2wgurypey9
        foreign key (group_fk)
        references groups (id);

    alter table workgroups
        add constraint FK_sy995385kq0w6liidq3fidpvx
        foreign key (offering_fk)
        references offerings (id);

-- initial data for wise below


INSERT INTO granted_authorities VALUES (1,'ROLE_USER',0),(2,'ROLE_ADMINISTRATOR',0),(3,'ROLE_TEACHER',0),(4,'ROLE_STUDENT',0),(5,'ROLE_AUTHOR',0),(6,'ROLE_RESEARCHER',0),(7,'ROLE_TRUSTED_AUTHOR',0),(8,'ROLE_TRANSLATOR',0);

INSERT INTO portal (id,settings,projectMetadataSettings,run_survey_template,sendmail_on_exception,OPTLOCK) VALUES (1,'{isLoginAllowed:true}','{"fields":[{"name":"Title","key":"title","type":"input"},{"name":"Summary","key":"summary","type":"textarea"},{"name":"Language","key":"language","type":"radio","choices":["English","Chinese (Simplified)","Chinese (Traditional)","Dutch","German","Greek","Hebrew","Japanese","Korean","Portuguese","Spanish","Thai","Turkish"]},{"name":"Subject","key":"subject","type":"radio","choices":["Life Science","Physical Science","Earth Science","General Science","Biology","Chemistry","Physics","Other"]},{"name":"Time Required to Complete Project","key":"time","type":"input"},{"name":"Supported Devices","key":"supportedDevices","type":"checkbox","choices":["PC","Tablet"]}],"i18n":{"lifeScience":{"en":"Life Science","ja":"ライフサイエンス"},"earthScience":{"en":"Earth Science","ja":"地球科学"},"physicalScience":{"en":"Physical Science","ja":"物理科学","es":"ciencia física"}}}','{"save_time":null,"items":[{"id":"recommendProjectToOtherTeachers","type":"radio","prompt":"How likely would you recommend this project to other teachers?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"runProjectAgain","type":"radio","prompt":"How likely would you run this project again?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"useWISEAgain","type":"radio","prompt":"How likely would you use WISE again in your classroom?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"adviceForOtherTeachers","type":"textarea","prompt":"Please share any advice for other teachers about this project or about WISE in general.","answer":null},{"id":"technicalProblems","type":"textarea","prompt":"Please write about any technical problems that you had while running this project.","answer":null},{"id":"generalFeedback","type":"textarea","prompt":"Please provide any other feedback to WISE staff.","answer":null}]}',1,0);

INSERT INTO user_details (id, account_not_expired, account_not_locked, credentials_not_expired, email_address, enabled, language, password, username, OPTLOCK)  VALUES (1,1,1,1,NULL,1,'en','24c002f26c14d8e087ade986531c7b5d','admin',0),(2,1,1,1,NULL,1,'en','4cd92091d686b42ec74a29a26432915a','preview',0);

INSERT INTO users (id, OPTLOCK, user_details_fk) VALUES (1,0,1),(2,0,2);

INSERT INTO teacher_user_details (city,country,curriculumsubjects,displayname,isEmailValid,firstname,lastlogintime,lastname,numberoflogins,schoollevel,schoolname,signupdate,state,id) VALUES ('Berkeley','USA',NULL,'adminuser',0,'ad',NULL,'min',0,3,'Berkeley','2010-10-25 15:41:31','CA',1),('Berkeley','USA',NULL,'preview',0,'pre',NULL,'view',0,3,'Berkeley','2010-10-25 15:41:31','CA',2);

INSERT INTO user_details_related_to_roles VALUES (1,1),(1,2),(1,3),(1,5),(2,1),(2,3),(2,5);
