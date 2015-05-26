$(document).ready(function () {
  $(".fb-album-container").FacebookAlbumBrowser({
        account: "NUSResidentialCollege4",
        skipAlbums: ["Profile Pictures", "Timeline Photos", "Cover Photos"],
        showAccountInfo: false,
        showImageCount: false,
        showImageText: true,
        lightbox: true,
        photosCheckbox: false,
        likeButton: false,
        photoChecked: function(photo){
            console.log("PHOTO CHECKED: " + photo.id + " - " + photo.url + " - " + photo.thumb);
            console.log("CHECKED PHOTOS COUNT: " + this.checkedPhotos.length);
        },
        photoUnchecked: function (photo) {
            console.log("PHOTO UNCHECKED: " + photo.id + " - " + photo.url + " - " + photo.thumb);
            console.log("CHECKED PHOTOS COUNT: " + this.checkedPhotos.length);
        },
        albumSelected: function (photo) {
            console.log("ALBUM CLICK: " + photo.id + " - " + photo.url + " - " + photo.thumb);
        },
        photoSelected: function (photo) {
            console.log("PHOTO CLICK: " + photo.id + " - " + photo.url + " - " + photo.thumb);
        }
    });
});