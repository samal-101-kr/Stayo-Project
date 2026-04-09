const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required:true,
        min:0
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
            default: []
        },
    ],
    owner: {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    category: {
        type: String,
        enum: [
            "trending",
            "rooms",
            "iconic",
            "mountain",
            "castles",
            "pools",
            "camping",
            "farms",
            "arctic"
        ],
        default: "trending"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


// set : (v) => v === "" ? "https://unsplash.com/photos/close-up-of-dark-green-grass-blades-mo2p9TIqFrc" : v