/* eslint-disable @next/next/link-passhref */
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { apiAuth, URLS } from "../../../../../api";
import {
  Banner,
  FeaturesCardList,
  MainLayout,
} from "../../../../../components";
import { ChevronUpIcon } from "../../../../../components/Icons";
import { Routes } from "../../../../../constants";
import { Meta } from "../../../../../container";
import { useInfinitePagination, useRedux } from "../../../../../hooks";
import {
  getCollectionyIdAsync,
  selectCollectionById,
  selectLoading,
  storeActions,
} from "../../../../../redux";
import { CollectionById } from "../../../../../types";
import s from "./CollectionDetail.module.scss";

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { data } = await apiAuth.get(
      `${URLS.collectionById
        .replace("<userId>", `${context.query.profile_id}`)
        .replace(
          "<collectionId>",
          `${context.query.id}`
        )}?page_size=${1}&page_number=${1}`
    );

    return {
      props: {
        collection: data,
        collectionId: context.query.id,
        userId: context.query.profile_id,
      },
    };
  } catch (error: any) {
    return {
      props: {
        collectionId: context.query.id,
        userId: context.query.profile_id,
      },
    };
  }
}

type CollectionDetailProps = {
  collection: CollectionById;
  collectionId: string;
  userId: string;
};

const CollectionDetail = ({
  collectionId,
  userId,
  collection,
}: CollectionDetailProps) => {
  const [select, dispatch] = useRedux();
  const { query, push } = useRouter();

  const loading: boolean = select(selectLoading);

  const { resetCollectionByID } = storeActions;

  const { items, handleNext, hasMore } = useInfinitePagination({
    query: getCollectionyIdAsync,
    selectData: selectCollectionById,
    resetFunc: resetCollectionByID,
    perPage: 25,
    queryProps: {
      collectionId,
      userId,
    },
  });

  const handleOnCardClick = (id: string) => push(`${Routes.NFT}/${id}`);

  return (
    <>
      <Meta title={`Chronicle | ${collection?.collection_name}`} />
      <div className={s.navigation}>
        <Link href={`/profile/${query.profile_id}/collection`}>
          <div className={s.nav1}>Collection</div>
        </Link>
        <ChevronUpIcon className={s.arror} />
        <div className={s.nav2}>{collection.collection_name}</div>
      </div>
      <Banner data={collection} />
      <div className={s.container}>
        <FeaturesCardList
          data={items || []}
          handleOnCardClick={handleOnCardClick}
          withoutLink={true}
          loading={loading}
          handleNext={handleNext}
          hasMore={hasMore}
        />
      </div>
    </>
  );
};

CollectionDetail.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default CollectionDetail;
