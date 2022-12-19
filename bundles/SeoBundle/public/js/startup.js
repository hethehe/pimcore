pimcore.registerNS("pimcore.seo");


pimcore.seo = Class.create({
    initialize: function () {
        // TODO mattamon add key event once the new event is merged
        //document.addEventListener(pimcore.events.preRegisterKeyBindings, this.registerKeyBinding.bind(this));
        document.addEventListener(pimcore.events.pimcoreReady, this.pimcoreReady.bind(this));
    },

    pimcoreReady: function (e) {
        const user = pimcore.globalmanager.get('user');
        const perspectiveCfg = pimcore.globalmanager.get("perspective");

        if (perspectiveCfg.inToolbar("marketing") && perspectiveCfg.inToolbar("marketing.seo")) {
            var seoMenu = [];

            if (user.isAllowed("documents") && user.isAllowed("seo_document_editor") && perspectiveCfg.inToolbar("marketing.seo.documents")) {
                seoMenu.push({
                    text: t("seo_document_editor"),
                    iconCls: "pimcore_nav_icon_document_seo",
                    itemId: 'pimcore_menu_marketing_seo_document_editor',
                    handler: this.showDocumentSeo
                });
            }

            if (user.isAllowed("robots.txt") && perspectiveCfg.inToolbar("marketing.seo.robots")) {
                seoMenu.push({
                    text: t("robots.txt"),
                    iconCls: "pimcore_nav_icon_robots",
                    itemId: 'pimcore_menu_marketing_seo_robots_txt',
                    handler: this.showRobotsTxt
                });
            }

            if (user.isAllowed("http_errors") && perspectiveCfg.inToolbar("marketing.seo.httperrors")) {
                seoMenu.push({
                    text: t("http_errors"),
                    iconCls: "pimcore_nav_icon_httperrorlog",
                    itemId: 'pimcore_menu_marketing_seo_http_errors',
                    handler: this.showHttpErrorLog
                });
            }

            // get index of marketing.targeting
            if (seoMenu.length > 0) {
                const toolbar = pimcore.globalmanager.get('layout_toolbar');
                // try to insert it after the marketing_personalization
                // setting constant index, user maybe does not have the rights for marketing_personalization
                const index = 2;
                toolbar.marketingMenu.insert(index, {
                    text: t("search_engine_optimization"),
                    iconCls: "pimcore_nav_icon_seo",
                    itemId: 'pimcore_menu_marketing_seo',
                    hideOnClick: false,
                    menu: {
                        cls: "pimcore_navigation_flyout",
                        shadow: false,
                        items: seoMenu
                    }
                });
            }
        }
    },

    showDocumentSeo: function () {
        try {
            pimcore.globalmanager.get("seo_seopanel").activate();
        }
        catch (e) {
            pimcore.globalmanager.add("seo_seopanel", new pimcore.seo.seopanel());
        }
    },

    showRobotsTxt: function () {
        try {
            pimcore.globalmanager.get("robotstxt").activate();
        }
        catch (e) {
            pimcore.globalmanager.add("robotstxt", new pimcore.seo.robotstxt());
        }
    },

    showHttpErrorLog: function () {
        try {
            pimcore.globalmanager.get("http_error_log").activate();
        }
        catch (e) {
            pimcore.globalmanager.add("http_error_log", new pimcore.seo.httpErrorLog());
        }
    },

    registerKeyBinding: function(e) {
        const user = pimcore.globalmanager.get('user');
    }
})

const seo = new pimcore.seo();