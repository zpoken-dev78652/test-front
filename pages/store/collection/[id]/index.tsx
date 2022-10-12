import { Meta } from "../../../../container";
import {
  getCollectionByID,
  selectAllitemsCollections,
} from "../../../../redux";
import {
  useActionElement,
  useInfinitePagination,
  useMediaQuery,
  useRedux,
  useStringifyFilters,
} from "../../../../hooks";
import {
  selectBoughtError,
  selectInfoMessage,
  selectUserData,
  storeActions,
} from "../../../../redux";
import {
  CardModal,
  ConfirmBoughtModal,
  FeaturesCardList,
  ItemBoughtErrorModal,
  MainLayout,
  Modal,
} from "../../../../components";
import { initialComponentState, reducer } from "../../../../reducers";
import { CollectionType, User } from "../../../../types";
import { infoMessages, mobileWidth } from "../../../../constants";
import { useRouter } from "next/router";
import {
  EMAIL_NOT_VERIFIED,
  FREE_NFT_DUPLICATE,
  ITEM_DUPLICATE,
  NO_AVALIBLE_NFTS,
  PAYMENT_ERROR,
  TOP_BIDDER,
  VERIFY_REGISTER,
} from "../../../../components/modals/ItemBoughtErrorModal/data";
import { api, URLS } from "../../../../api";
import { useReducer } from "react";
import s from "../Collection.module.scss";
import {
  FacebookCircleIcon,
  SubtractIcon,
  TwitterIcon,
  WebsiteIcon,
  YoutubeIcon,
} from "../../../../components/Icons";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  try {
    const { data } = await api.get(
      `${URLS.collectionsById.replace(
        "<id>",
        `${id}`
      )}?page_size=15&page_number=1`
    );
    return { props: { id, collectionInfo: data?.collection ?? [] } };
  } catch (error: any) {
    return {
      props: { id, collectionInfo: [] },
    };
  }
};

type CollectionDetailProps = { id: string; collectionInfo: CollectionType };

const CollectionDetail = ({ id, collectionInfo }: CollectionDetailProps) => {
  const { asPath, push } = useRouter();
  const [select, dispatch] = useRedux();
  const { removeInfoMessage, setError, setLoading, resetAuth } = storeActions;

  const infoMessage = select(selectInfoMessage);
  const user: User = select(selectUserData);
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const [data] = useReducer(reducer, initialComponentState);

  const { url } = useStringifyFilters({ data });

  const {
    items: chronicleStore,
    handleNext,
    hasMore,
  } = useInfinitePagination({
    query: getCollectionByID,
    selectData: selectAllitemsCollections,
    resetFunc: resetAuth,
    perPage: 20,
    id,
    url,
  });

  const {
    itemForBuy,
    card,
    modalsState,
    waitingPayment,
    buyWithStripe,
    buyWithWallet,
    setCard,
    handleBuyClick,
    onBuyAnywayClick,
    handleSelectItem,
    handleAllCancel,
    handleClosePayError,
    handleRetry,
    handleCloseWarningModal,
  } = useActionElement({ type: "Item" });

  const error: string | null = select(selectBoughtError);

  const handleOnCardClick = (id: string, type?: string) => {
    push(`/store/${type || "item"}/${id}`);
  };

  return (
    <div className={s.container}>
      <Meta
        title={collectionInfo?.name}
        description=""
        image={collectionInfo?.banner_mobile}
        url={`${process.env.NEXT_PUBLIC_DOMAIN}${asPath}`}
      />

      <div className={s.banner}>
        <img
          src={
            isMobile ? collectionInfo?.banner_mobile : collectionInfo?.banner
          }
          alt={collectionInfo?.name}
        />
      </div>

      <div className={s.infoWrap}>
        <div className={s.infoContent}>
          <img
            className={s.logo}
            src={collectionInfo?.logo}
            alt="logo collection"
          />
          <div className={s.content}>
            <h1 className={s.title}>{collectionInfo?.name}</h1>
            <h5 className={s.subTitle}>
              {collectionInfo?.store_name}
              <SubtractIcon className={s.nameIcon} size={12} />
            </h5>
          </div>
          <p className={s.desc}>{collectionInfo?.description}</p>
        </div>
        <div className={s.socials}>
          {collectionInfo?.facebook_link && (
            <div className={s.social}>
              <h5 className={s.title}>
                <FacebookCircleIcon size={22} />
                Facebook
              </h5>
              <a
                className={`${s.link} violetLink ellipsis`}
                href={`${collectionInfo?.facebook_link}`}
                target="_blank"
                rel="noreferrer"
              >
                {collectionInfo?.facebook_link}
              </a>
            </div>
          )}
          {collectionInfo?.twitter_link && (
            <div className={s.social}>
              <h5 className={s.title}>
                <TwitterIcon fill="#1DA1F2" width={22} height={22} />
                Twitter
              </h5>
              <a
                className={`${s.link} violetLink ellipsis`}
                href={collectionInfo?.twitter_link}
                target="_blank"
                rel="noreferrer"
              >
                {collectionInfo?.twitter_link}
              </a>
            </div>
          )}
          {collectionInfo?.youtube_link && (
            <div className={s.social}>
              <h5 className={s.title}>
                <YoutubeIcon fill="#FF0000" width={22} height={22} />
                youtube
              </h5>
              <a
                className={`${s.link} violetLink ellipsis`}
                href={collectionInfo?.youtube_link}
                target="_blank"
                rel="noreferrer"
              >
                {collectionInfo?.youtube_link}
              </a>
            </div>
          )}
          {collectionInfo?.website_link && (
            <div className={s.social}>
              <h5 className={s.title}>
                <WebsiteIcon size={22} />
                website
              </h5>
              <a
                className={`${s.link} violetLink ellipsis`}
                href={collectionInfo?.website_link}
                target="_blank"
                rel="noreferrer"
              >
                {collectionInfo?.website_link}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className={s.chronicleStore}>
        <FeaturesCardList
          userId={user.id}
          data={chronicleStore ?? []}
          handleSelectItem={handleSelectItem}
          handleOnCardClick={handleOnCardClick}
          loading={infoMessage.some(
            (el) => el === infoMessages.LOADING_COLLECTIONS_BY_ID
          )}
          handleNext={handleNext}
          hasMore={hasMore}
        />
      </div>
      {modalsState.info && !error && (
        <Modal isCloseBtnHidden={true}>
          <CardModal
            data={itemForBuy}
            onClose={handleAllCancel}
            handleBuy={handleBuyClick}
            userId={user.id}
          />
        </Modal>
      )}
      {modalsState.duplicate && (
        <ItemBoughtErrorModal
          error={ITEM_DUPLICATE}
          onCancelClick={handleAllCancel}
          onBuyClick={onBuyAnywayClick}
        />
      )}

      {modalsState.buy && (
        <Modal isCloseBtnHidden={true}>
          <ConfirmBoughtModal
            item={itemForBuy}
            handleCard={setCard}
            handleNevermindClick={handleAllCancel}
            buyWithStripe={buyWithStripe}
            buyWithWallet={buyWithWallet}
            waitingPayment={waitingPayment}
            card={card}
          />
        </Modal>
      )}
      {(error === EMAIL_NOT_VERIFIED ||
        error === NO_AVALIBLE_NFTS ||
        error === VERIFY_REGISTER ||
        error === TOP_BIDDER ||
        error === FREE_NFT_DUPLICATE) && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
        />
      )}
      {(error === PAYMENT_ERROR || error === "Your card was declined.") &&
        modalsState?.error && (
          <ItemBoughtErrorModal
            error={error}
            onCancelClick={handleClosePayError}
            onBuyClick={handleRetry}
          />
        )}
    </div>
  );
};

CollectionDetail.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default CollectionDetail;
