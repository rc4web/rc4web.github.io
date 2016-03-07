﻿/*
 * jQuery Plugin: jQuery Facebook Album Browser
 * https://github.com/dejanstojanovic/Facebook-Album-Browser
 * Version 1.0.0
 *
 * Copyright (c) 2015 Dejan Stojanovic (http://dejanstojanovic.net)
 *
 * Released under the MIT license
 */

(function ($) {
    $.fn.FacebookAlbumBrowser = function (options) {
        var defaults = {
            account: "",
            accessToken: "",
            showAccountInfo: true,
            showImageCount: true,
            skipEmptyAlbums: true,
            skipAlbums: [],
            lightbox: true,
            photosCheckbox: true,
            albumSelected: null,
            photoSelected: null,
            photoChecked: null,
            photoUnchecked: null,
            showImageText: false,
            likeButton: true,
            shareButton:true,
            albumsPageSize: 0,
            albumsMoreButtonText: "more albums...",
            photosPageSize: 0,
            photosMoreButtonText: "more photos...",
            checkedPhotos: []
        }

        var settings = $.extend({}, defaults, options);
        var selector = $(this);

        selector.each(function (index) {
            var container = selector.get(index);
            if (settings.showAccountInfo) {
                addAccountInfo(container);
            }
            $(container).append($('<ul>', {
                class: "fb-albums"
            }));
            var albumList = $(container).find(".fb-albums");
            var invokeUrl = "https://graph.facebook.com/" + settings.account + "/albums";
            if (settings.accessToken != "") {
                invokeUrl += "?access_token=" + settings.accessToken;
            }

            loadAlbums(invokeUrl);
            function loadAlbums(url) {
                $.ajax({
                    type: 'GET',
                    url: url,
                    cache: false,
                    dataType: 'jsonp',
                    success: function (result) {
                        if ($(result.data).length > 0) {

                            if (settings.albumsPageSize > 0) {
                                var moreButton = $(container).find(".fb-btn-more");
                                if (moreButton.length == 0) {
                                    moreButton = $("<div>", { class: "fb-btn-more fb-albums-more", text: settings.albumsMoreButtonText });
                                    $(container).append(moreButton);
                                    $(moreButton).click(function () {
                                        var _this = $(this);
                                        $(container).find("li.fb-album:hidden").slice(0, settings.albumsPageSize).fadeIn(function () {
                                            if ($(container).find("li.fb-album:hidden").length == 0) {
                                                _this.fadeOut(function () {
                                                    _this.remove();
                                                });
                                            }
                                        });


                                    });
                                }
                            }

                            for (a = 0; a < $(result.data).length; a++) {
                                if (settings.skipAlbums.indexOf($(result.data).get(a).name) > -1 || settings.skipAlbums.indexOf($(result.data).get(a).id.toString()) > -1) {
                                    continue;
                                }
                                var albumListItem = $("<li>", { class: "fb-album", "data-id": $(result.data).get(a).id });
                                if ($(result.data).get(a).count == null && settings.skipEmptyAlbums) {
                                    continue;
                                }
                                else {
                                    var invokeUrl = "https://graph.facebook.com/" + $(result.data).get(a).cover_photo;
                                    if (settings.accessToken != "") {
                                        invokeUrl += "?access_token=" + settings.accessToken;
                                    }
                                    $.ajax({
                                        type: 'GET',
                                        url: invokeUrl,
                                        cache: false,
                                        data: { album: $(result.data).get(a).id },
                                        dataType: 'jsonp',
                                        success: function (cover) {
                                            var listItem = $("li.fb-album[data-id='" + getParameterByName("album", $(this).get(0).url) + "'] ");
                                            if (!$(cover).get(0).error && $(cover).get(0).images) {
                                                var prefWidth = listItem.width();
                                                var prefHeight = listItem.height();
                                                var albumImg = $(cover.images)[0]
                                                for (i = 0; i < $(cover.images).length; i++) {
                                                    if (
                                                            ($(cover.images)[i].height >= prefHeight && $(cover.images)[i].width >= prefWidth) &&
                                                            ($(cover.images)[i].height <= albumImg.height && $(cover.images)[i].width <= albumImg.width)
                                                        ) {
                                                        albumImg = $(cover.images)[i];
                                                    }
                                                }
                                                var albumThumb = $("<img>", { style: "margin-left:" + (prefWidth - albumImg.width) / 2 + "px; display:none;", "data-id": $(cover).get(0).id, class: "fb-album-thumb", "data-src": albumImg.source, src: "" })
                                                listItem.append(albumThumb);

                                                $(albumThumb).load(function () {
                                                    $(this).fadeIn(300);
                                                });

                                                loadIfVisible(albumThumb);
                                                $(window).scroll(function () {
                                                    $(".fb-album-thumb[src='']").each(function () {
                                                        return loadIfVisible($(this));
                                                    });
                                                    $(".fb-photo-thumb[src='']").each(function () {
                                                        return loadIfVisible($(this));
                                                    });
                                                });
                                            }
                                            else {
                                                listItem.remove();
                                            }
                                        }
                                    });
                                    albumListItem.append($("<div>", { class: "fb-album-title", text: $(result.data).get(a).name }));
                                    if (settings.showImageCount) {
                                        albumListItem.append($("<div>", { class: "fb-album-count", text: $(result.data).get(a).count }));
                                    }
                                    $(albumList).append(albumListItem);


                                    if (settings.albumsPageSize > 0 && $(albumList).find("li").index(albumListItem) >= settings.albumsPageSize) {
                                        albumListItem.hide();
                                        $(container).find(".fb-albums-more").fadeIn();
                                    }

                                    $(albumListItem).click(function () {
                                        var self = $(this);
                                        $(selector).append($("<div>", { class: "fb-album-preview" }));
                                        $(selector).find("div.fb-albums-more").hide();
                                        var previewContainer = selector.find(".fb-album-preview");
                                        previewContainer.append($("<img>", {
                                            alt: "",
                                            height: 32,
                                            width: 32,
                                            src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyMnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMiAyMiIgd2lkdGg9IjIycHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzPjxwYXRoIGQ9Ik0wLDExIEMwLDQuOTI0ODY3NDUgNC45MjQ4Njc0NSwwIDExLDAgQzE3LjA3NTEzMjUsMCAyMiw0LjkyNDg2NzQ1IDIyLDExIEMyMiwxNy4wNzUxMzI1IDE3LjA3NTEzMjUsMjIgMTEsMjIgQzQuOTI0ODY3NDUsMjIgMCwxNy4wNzUxMzI1IDAsMTEgTDAsMTEgWiBNMjEsMTEgQzIxLDUuNDc3MTUyMjUgMTYuNTIyODQ3OCwxIDExLDEgQzUuNDc3MTUyMjUsMSAxLDUuNDc3MTUyMjUgMSwxMSBDMSwxNi41MjI4NDc4IDUuNDc3MTUyMjUsMjEgMTEsMjEgQzE2LjUyMjg0NzgsMjEgMjEsMTYuNTIyODQ3OCAyMSwxMSBMMjEsMTEgWiBNNS41LDExIEw4LjUsMTUgTDkuNSwxNSBMNi43NSwxMS40OTg0Mzc1IEwxNi41LDExLjQ5ODQzNzQgTDE2LjUsMTAuNSBMNi43NSwxMC41IEw5LjUsNyBMOC41LDcgTDUuNSwxMSBMNS41LDExIFoiIGlkPSJwYXRoLTEiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBpZD0ibWl1IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSI+PGcgaWQ9ImNpcmNsZV9hcnJvdy1iYWNrX3ByZXZpb3VzX291dGxpbmVfc3Ryb2tlIj48dXNlIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgeGxpbms6aHJlZj0iI3BhdGgtMSIvPjx1c2UgZmlsbD0ibm9uZSIgeGxpbms6aHJlZj0iI3BhdGgtMSIvPjwvZz48L2c+PC9zdmc+",
                                            class: "fb-albums-list"
                                        }));
                                        previewContainer.append($("<h3>", { class: "fb-album-heading", text: $(self).find(".fb-album-title").text() }));
                                        previewContainer.find("img.fb-albums-list,h3.fb-album-heading").click(function () {
                                            previewContainer.fadeOut(function () {
                                                $(selector).find(".fb-albums").fadeIn(function () {
                                                    if (settings.albumsPageSize > 0 && $(selector).find("li.fb-album:hidden").length > 0) {
                                                        $(selector).find("div.fb-albums-more").show();
                                                    }
                                                });
                                                previewContainer.remove();
                                            });
                                        });
                                        $(previewContainer).append($("<ul>", { class: "fb-photos" }));
                                        photosContainer = $(previewContainer).find("ul.fb-photos");

                                        var invokeUrl = "https://graph.facebook.com/" + $(self).attr("data-id") + "/photos";
                                        if (settings.accessToken != "") {
                                            invokeUrl += "?access_token=" + settings.accessToken;
                                        }

                                        if (settings.albumSelected != null && typeof (settings.albumSelected) == "function") {
                                            settings.albumSelected({
                                                id: $(self).attr("data-id"),
                                                url: invokeUrl,
                                                thumb: $(self).find("img.fb-album-thumb").attr("src")
                                            });
                                        }

                                        loadPhotos(invokeUrl, photosContainer);

                                        $(selector).find("ul.fb-albums").fadeOut(function () {
                                            previewContainer.fadeIn();
                                        });
                                    });
                                    $(albumListItem).hover(function () {
                                        var self = $(this);
                                        self.find("div.fb-album-title").slideToggle(300);
                                    });
                                }
                            }

                            if (result.paging && result.paging.next && result.paging.next != "") {
                                loadAlbums(result.paging.next);
                            }
                            //cond end
                        }
                    }
                });
            }

            function loadPhotos(url, container) {
                $.ajax({
                    type: 'GET',
                    url: url,
                    cache: false,
                    dataType: 'jsonp',
                    success: function (result) {

                        if (result.data.length > 0) {

                            if (settings.photosPageSize > 0) {
                                var moreButton = $(container).parent().find(".fb-btn-more");
                                if (moreButton.length == 0) {
                                    moreButton = $("<div>", { class: "fb-btn-more fb-photos-more", text: settings.photosMoreButtonText });
                                    $(container).parent().append(moreButton);
                                    $(moreButton).click(function () {
                                        var _this = $(this);
                                        $(container).find("li.fb-photo:hidden").slice(0, settings.photosPageSize).fadeIn(function () {
                                            if ($(container).find("li.fb-photo:hidden").length == 0) {
                                                _this.fadeOut(function () {
                                                    _this.remove();
                                                });
                                            }
                                        });
                                    });
                                }
                            }


                            for (a = 0; a < result.data.length; a++) {
                                var photoListItem = $("<li>", { class: "fb-photo" });
                                var prefWidth = photoListItem.width();
                                var prefHeight = photoListItem.height();
                                var albumImg = $(result.data)[a].images[0];
                                for (i = 0; i < $(result.data)[a].images.length; i++) {
                                    if (
                                            ($(result.data)[a].images[i].height >= prefHeight && $(result.data)[a].images[i].width >= prefWidth) &&
                                            ($(result.data)[a].images[i].height <= albumImg.height && $(result.data)[a].images[i].width <= albumImg.width)
                                        ) {
                                        albumImg = $(result.data)[a].images[i];
                                    }
                                }
                                var photoLink = $("<a>", { class: "fb-photo-thumb-link", href: $(result.data)[a].source, "data-fb-page": $(result.data)[a].link });
                                var marginWidth = 0;

                                if (prefWidth > 0) {
                                    marginWidth = (prefWidth - albumImg.width) / 2;
                                }

                                if (settings.photosCheckbox) {
                                    var imageCheck = $("<div>", { class: "image-check" });
                                    imageCheck.click(function () {
                                        var eventObj = {
                                            id: $(this).parent().find("img.fb-photo-thumb").attr("data-id"),
                                            url: $(this).parent().find("a").attr("href"),
                                            thumb: $(this).parent().find("img.fb-photo-thumb").attr("src")
                                        };
                                        $(this).toggleClass("checked");
                                        if ($(this).hasClass("checked")) {
                                            if (settings.photoChecked != null && typeof (settings.photoChecked) == "function") {
                                                settings.checkedPhotos.push(eventObj);
                                                settings.photoChecked(eventObj);
                                            }
                                        }
                                        else {
                                            if (settings.photoUnchecked != null && typeof (settings.photoUnchecked) == "function") {
                                                for (i = 0; i < settings.checkedPhotos.length; i++) {
                                                    if (settings.checkedPhotos[i].id == eventObj.id) {
                                                        settings.checkedPhotos.splice(i, 1);
                                                        settings.photoUnchecked(eventObj);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        return false;
                                    });
                                }
                                var photoThumb = $("<img>", { style: "margin-left:" + marginWidth + "px;display:none;", "data-id": $(result.data).get(a).id, class: "fb-photo-thumb", "data-src": albumImg.source, src: "" });
                                var photoText = $("<span>", { class: "fb-photo-text" });
                                photoText.text($(result.data).get(a).name);
                                photoLink.append(photoText);

                                photoLink.append(photoThumb);
                                if (settings.photosCheckbox) {
                                    photoListItem.append(imageCheck);
                                    for (i = 0; i < settings.checkedPhotos.length; i++) {
                                        if (settings.checkedPhotos[i].id == $(result.data).get(a).id) {
                                            imageCheck.addClass("checked");
                                            break;
                                        }
                                    }
                                }
                                photoListItem.append(photoLink);

                                container.append(photoListItem);
                                if (settings.photosPageSize > 0 && $(container).find("li").index(photoListItem) >= settings.photosPageSize) {
                                    photoListItem.hide();
                                    $(container).find(".fb-photos-more").fadeIn();
                                }

                                $(photoThumb).load(function () {
                                    $(this).fadeIn(300);
                                });
                                loadIfVisible(photoThumb);
                                initLightboxes(container.find("a.fb-photo-thumb-link"));
                            }

                            if (result.paging && result.paging.next && result.paging.next != "") {
                                loadPhotos(result.paging.next, container);
                            }




                        }

                    }
                });
            }

            function loadIfVisible(photoThumb) {
                var element = null;
                if ($(photoThumb).hasClass("fb-photo-thumb")) {
                    element = $(photoThumb).parent().parent();
                }
                else if ($(photoThumb).hasClass("fb-album-thumb")) {
                    element = $(photoThumb).parent();
                }

                if (element != null) {
                    if (isScrolledIntoView($(element)) && $(photoThumb).attr("src") == "") {
                        $(photoThumb).attr("src", $(photoThumb).attr("data-src"));
                        $(photoThumb).removeAttr("data-src");

                        return true;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            }

            function addAccountInfo(container) {
                var accountInfoContainer = $("<div>", { class: "fb-account-info" });
                var accountInfoLink = $("<a>", { target: "_blank", href: "" });
                accountInfoContainer.append(accountInfoLink);
                accountInfoLink.append($("<img>", { src: "https://graph.facebook.com/" + settings.account + "/picture?type=square" }));
                accountInfoLink.append($("<h3>", { class: "fb-account-heading" }));
                $(container).append(accountInfoContainer);
                $.ajax({
                    type: 'GET',
                    url: "https://graph.facebook.com/" + settings.account,
                    cache: false,
                    dataType: 'jsonp',
                    success: function (result) {
                        $(container).find(".fb-account-info").find(".fb-account-heading").text(result.name);
                        $(container).find(".fb-account-info").find("a").attr("href", "http://facebook.com/" + (!result.username ? result.id : result.username));
                    }
                });
            }

            function addLikeButton(container, url) {
                if (settings.likeButton) {
                    var likeBtn = $("<div>", { "data-show-faces": "false", class: "fb-like", "data-href": url, "data-action": "like", "data-layout": "box_count", "data-share": settings.shareButton, "data-show-faces": "false" });
                    var likeBtnContainer = $("<div>", { class: "fb-like-container" });
                    likeBtnContainer.append(likeBtn);
                    container.prepend(likeBtnContainer);
                    FB.XFBML.parse();
                }
            }

            function initLightboxes(photoLink) {
                var overlay = $(".fb-preview-overlay");
                if (overlay.length == 0) {
                    overlay = $("<div>", { class: "fb-preview-overlay" });
                    var lightboxContent = $("<div>", { class: "fb-preview-content" });

                    overlay.append(lightboxContent);
                    lightboxContent.append($("<img>", { class: "fb-preview-img" }));
                    if (settings.showImageText || settings.likeButton) {
                        lightboxContent.append($("<span>", { class: "fb-preview-text" }));
                    }
                    overlay.append($("<img>", { class: "fb-preview-img-prev", src: "img/plugins/prev-icon.png" }));
                    overlay.append($("<img>", { class: "fb-preview-img-next", src: "img/plugins/next-icon.png" }));

                    $("body").append(overlay);
                    overlay = $(".fb-preview-overlay");
                    $(overlay).click(function () {
                        $(this).fadeOut();
                    });
                    $(overlay).find(".fb-preview-img").click(function () {
                        $(this).parent().find("img.fb-preview-img-next").click();
                        return false;
                    });

                    if (settings.likeButton) {
                        $("body").append("<div>", { id: "fb-root" });

                        (function (d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) return;
                            js = d.createElement(s); js.id = id;
                            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=775908159169504";
                            fjs.parentNode.insertBefore(js, fjs);
                        }(document, 'script', 'facebook-jssdk'));
                    }
                }
                else {
                    overlay = $(".fb-preview-overlay");
                }


                $(photoLink).unbind("click");
                $(photoLink).click(function (event) {
                    var previewText = $(".fb-preview-text");
                    var previewContent = $(".fb-preview-content");
                    previewContent.hide();
                    if (settings.showImageText) {
                        previewText.html(parseLinks($(this).find(".fb-photo-text").text()));
                    }

                    addLikeButton(previewText, $(this).attr("data-fb-page"));

                    var eventObj = {
                        id: $(this).find("img.fb-photo-thumb").attr("data-id"),
                        url: $(this).attr("href"),
                        thumb: $(this).find("img.fb-photo-thumb").attr("data-id")
                    };
                    if (settings.photoSelected != null && typeof (settings.photoSelected) == "function") {
                        settings.photoSelected(eventObj);
                    }
                    if (settings.lightbox) {
                        var overlay = $(".fb-preview-overlay");
                        var previewImage = overlay.find("img.fb-preview-img");
                        previewImage.hide();
                        overlay.find("img.fb-preview-img-prev,img.fb-preview-img-next").hide();
                        previewImage.attr("src", $(this).attr("href"));

                        if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
                            $(previewImage).show();
                        }
                        previewImage.load(function () {
                            previewContent.css("display", "block");
                            if (previewText.text().trim() != "" || settings.likeBtn) {
                                previewText.css("display", "block");
                            }
                            else {
                                previewText.hide();
                            }
                            previewText.css("maxWidth", $(this).width() - 12);
                            $(this).show();
                            var prevImg = overlay.find("img.fb-preview-img-prev");
                            prevImg.show();
                            prevImg.unbind("click");
                            prevImg.click(function () {

                                var currentImage = $(this).parent().find(".fb-preview-img");
                                var currentImageLinkItem = $("[href='" + currentImage.attr("src") + "']");
                                if (currentImageLinkItem.length != 0) {
                                    var prev = currentImageLinkItem.parent().prev();
                                    var prevImg = null;
                                    if (prev.length != 0) {
                                        prevImg = prev.find(".fb-photo-thumb-link");
                                        previewImage.attr("src", prevImg.attr("href"));
                                    }
                                    else {
                                        prevImg = currentImageLinkItem.parent().parent().find("li").last().find(".fb-photo-thumb-link");
                                        previewImage.attr("src", prevImg.attr("href"));
                                    }
                                    previewContent.hide();
                                    if (settings.showImageText) {
                                        previewText.html(parseLinks(prevImg.text()));
                                    }

                                    addLikeButton(previewText, prevImg.attr("data-fb-page"));
                                }
                                return false;
                            });

                            var nextImg = overlay.find("img.fb-preview-img-next");
                            nextImg.show();
                            nextImg.unbind("click");
                            nextImg.click(function () {

                                var currentImage = $(this).parent().find(".fb-preview-img");
                                var currentImageLinkItem = $("[href='" + currentImage.attr("src") + "']");
                                if (currentImageLinkItem.length != 0) {
                                    var next = currentImageLinkItem.parent().next();
                                    var nextImg = null;
                                    if (next.length != 0) {
                                        nextImg = next.find(".fb-photo-thumb-link");
                                        previewImage.attr("src", nextImg.attr("href"));
                                    }
                                    else {
                                        nextImg = currentImageLinkItem.parent().parent().find("li").first().find(".fb-photo-thumb-link");
                                        previewImage.attr("src", nextImg.attr("href"));
                                    }
                                    previewContent.hide();
                                    if (settings.showImageText) {
                                        previewText.html(parseLinks(nextImg.text()));
                                    }

                                    addLikeButton(previewText, nextImg.attr("data-fb-page"));
                                }
                                return false;
                            });
                            $(this).fadeIn();
                        });
                        overlay.fadeIn();
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                }
                );
            }

            function parseLinks(str) {
                var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig
                var result = str.replace(regex, "<a href='$1' target='_blank'>$1</a>");
                return result;
            }

            function getParameterByName(name, url) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(url);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            function isScrolledIntoView(elem) {
                var $elem = $(elem);
                var $window = $(window);
                var docViewTop = $window.scrollTop();
                var docViewBottom = docViewTop + $window.height();
                var elemTop = $elem.offset().top;
                var elemBottom = elemTop + $elem.height();
                return (elemTop <= docViewBottom);
            }

        });

        return this;
    }
})(jQuery);
