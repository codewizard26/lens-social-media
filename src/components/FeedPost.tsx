import React from "react";
import { ExplorePublicationsQuery } from "../graphql/generated";
import styles from '../styles/FeedPost.module.css'
import { MediaRenderer } from "@thirdweb-dev/react";
import Link from "next/link";


type Props = {
    publication: ExplorePublicationsQuery["explorePublications"]["items"][0]
}

function FeedPost({publication}: Props){
    return (
        <div className={styles.feedPostContainer}>
            <div className={styles.feedPostHeader}>
                {/* Author profile picture */}

                <MediaRenderer 
                //@ts-ignore
                src={publication?.profile?.picture?.original?.url || ""} 
                alt = {publication.profile.name || publication.profile.handle} 
                className={styles.feedPostProfilePicture}
                style={{width:48+"px",height:48+"px"}}
                />
                

                {/* author profile name */}
                <Link 
                    href = {`/profile/${publication.profile.handle}`}
                    className={styles.feedPostProfileName}>
                    {publication.profile.name || publication.profile.handle}
                </Link>

            </div>

            <div className={styles.feedPostContent}>
                {/* name of the post  */}
                <h3 className = {styles.feedPostContentTitle}>
                    {publication.metadata.name}</h3>

                {/* description of the post */}
                < p className={styles.feedPostContentDescription}>
                    {publication.metadata.content}
                </p>

                {/* image of the post */}
            {publication.metadata.media?.length > 0 &&
                (<MediaRenderer src={publication.metadata.media[0].original.url} 
            alt = {publication.metadata.name || ""}
            className = {styles.feedPostContentImage}
            />
            
            )
            
            }
            </div>

            <div className={styles.feedPostFooter}>
                <p> {publication.stats.totalAmountOfCollects} Collects</p>
                <p> {publication.stats.totalAmountOfCollects} Comments</p>
                <p> {publication.stats.totalAmountOfCollects} Mirrors</p>
            </div>
        </div>
    )
}

export default FeedPost