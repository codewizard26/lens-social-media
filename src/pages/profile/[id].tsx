import React from "react";
import styles from "../../styles/Profile.module.css";
import { useProfileQuery, usePublicationsQuery } from "@/src/graphql/generated";
import { useRouter } from "next/router";
import { MediaRenderer, Web3Button } from "@thirdweb-dev/react";
import { profile } from "console";
import FeedPost from "@/src/components/FeedPost";
import {
  LENS_CONTRACT_ABI,
  LENS_CONTRACT_ADDRESS,
} from "@/src/const/contracts";
import { useFollow } from "@/src/lib/useFollow";

type Props = {};

export default function ProfilePage({}: Props) {
  const router = useRouter();
  const { id } = router.query;

  const { mutateAsync: followUser } = useFollow();

  const {
    isLoading: loadingProfile,
    data: profileData,
    error: profileError,
  } = useProfileQuery(
    {
      request: {
        handle: id,
      },
    },
    {
      enabled: !!id,
    }
  );

  const {
    isLoading: isLoadingPublications,
    data: publicationsData,
    error: publicationsError,
  } = usePublicationsQuery(
    {
      request: {
        profileId: profileData?.profile?.id,
      },
    },
    {
      enabled: !!profileData?.profile?.id,
    }
  );

  console.log({
    profileData,
    loadingProfile,
    isLoadingPublications,
    publicationsData,
  });

  if (publicationsError || profileError) {
    return <div className={styles.loading}>Couldn't find this profile...</div>;
  }

  if (loadingProfile) {
    return <div className={styles.loading}>Loading Profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileContentContainer}>
        {/* Cover Picture */}
        {/* @ts-ignore */}
        {profileData?.profile?.coverPicture?.original?.url && (
          <MediaRenderer
            //@ts-ignore
            src={profileData?.profile?.coverPicture?.original?.url || ""}
            alt={
              profileData?.profile?.name || profileData?.profile?.handle || ""
            }
            className={styles.coverImageContainer}
          />
        )}
        {/* Profile picture */}
        {/* @ts-ignore */}
        {profileData?.profile?.picture?.original?.url && (
          <MediaRenderer
            //@ts-ignore
            src={profileData?.profile?.picture?.original?.url}
            alt={
              profileData?.profile?.name || profileData?.profile?.handle || ""
            }
            className={styles.profilePictureContainer}
          />
        )}

        {/* Profile Name */}
        <h1 className={styles.profileName}>
          {profileData?.profile?.name || "Anon User"}
        </h1>

        {/* Profile handle */}
        <p className={styles.profileHandle}>
          {profileData?.profile?.handle || "anon user"}
        </p>

        {/* Profile Description */}
        <p className={styles.profileDescription}>
          {profileData?.profile?.bio || ""}
        </p>
        <p className={styles.followerCount}>
          {profileData?.profile?.stats?.totalFollowers} {"followers"}
        </p>

        <Web3Button
          contractAddress={LENS_CONTRACT_ADDRESS}
          contractAbi={LENS_CONTRACT_ABI}
          action={async() => await followUser(profileData?.profile?.id)}
        >
          Follow User
        </Web3Button>
      </div>

      <div className={styles.publicationContainer}>
        {isLoadingPublications ? (
          <div className={styles.loading}>Loading Publications...</div>
        ) : (
          publicationsData?.publications?.items?.map((publication) => (
            <FeedPost publication={publication} key={publication.id} />
          ))
        )}
      </div>
    </div>
  );
}
