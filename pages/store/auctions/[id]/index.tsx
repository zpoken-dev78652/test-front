import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { api, URLS } from "../../../../api";
import {
  ItemBoughtErrorModal,
  ItemDetailCard,
  MainLayout,
} from "../../../../components";
import {
  EMAIL_NOT_VERIFIED,
  FREE_NFT_DUPLICATE,
  NO_AVALIBLE_NFTS,
  TOP_BIDDER,
} from "../../../../components/modals/ItemBoughtErrorModal/data";
import { errors } from "../../../../constants";
import { Meta } from "../../../../container";
import { transformPrice } from "../../../../helpers";
import { useActionElement, useRedux } from "../../../../hooks";
import {
  selectBalance,
  selectBoughtError,
  selectInfoMessage,
  selectIsAuth,
  selectLoading,
  selectUserData,
  storeActions,
} from "../../../../redux";
import { BalanceCurrency, StoreItem, User } from "../../../../types";
import s from "../Auction.module.scss";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  const res = await api.get(`${URLS.auction}/${id}`);

  if (!res) {
    return {
      notFound: true,
    };
  }

  return {
    props: { item: { ...res?.data }, id },
  };
};

type ItemProps = { item: StoreItem; id: string };

const Item = (props: ItemProps) => {
  const { item, id } = props;
  const { query, asPath, replace } = useRouter();

  const [select, dispatch] = useRedux();
  const [isRefetch, setisRefetch] = useState(false);
  const [price, setPrice] = useState(0);

  const balance = select(selectBalance);
  const storeLoading = select(selectLoading);
  const infoMessage = select(selectInfoMessage);
  const user: User = select(selectUserData);
  const error: string | null = select(selectBoughtError);
  const isAuth: boolean | null = select(selectIsAuth);

  const { handleBuyClick } = useActionElement({
    type: "Auction",
  });

  const { setError, setDuplicateItem, removeInfoMessage } = storeActions;

  useEffect(() => {
    if (!isAuth) {
      dispatch(setDuplicateItem(null));
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id, isAuth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (moment(item?.finish_datetime).utc().diff(moment().utc()) > 0) {
        setisRefetch(true);
      }

      if (
        moment(item?.finish_datetime).utc().diff(moment().utc()) <= 0 &&
        isRefetch
      ) {
        setisRefetch(false);
        replace(asPath);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefetch]);

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
    dispatch(removeInfoMessage("full"));
  };

  useEffect(() => {
    if (
      infoMessage.some((el) => el === "bid created") ||
      error === errors.WRONG_VALUE_BID
    ) {
      dispatch(removeInfoMessage("full"));
      replace(asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoMessage, error]);

  return (
    <div className={s.container}>
      <Meta
        title={item?.name}
        description=""
        image={item?.logo_preview}
        url={`${process.env.NEXT_PUBLIC_DOMAIN}${asPath}`}
      />
      {item ? (
        <ItemDetailCard
          userId={user.id}
          itemId={id}
          item={item}
          name={item?.name}
          setPrice={(e: number) => setPrice(e)}
          handleOnBuyClick={handleBuyClick}
          type="auction"
        />
      ) : (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      )}

      {(error === EMAIL_NOT_VERIFIED ||
        error === NO_AVALIBLE_NFTS ||
        error === TOP_BIDDER ||
        error === FREE_NFT_DUPLICATE) && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
        />
      )}

      {error === errors.WRONG_VALUE_BID && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
          onBuyClick={() => handleBuyClick(item, price)}
          loading={storeLoading}
        />
      )}

      {error === errors.CONFIRM_BID && (
        <ItemBoughtErrorModal
          text={
            <p>
              You are now depositing{" "}
              <span className={item?.default_price?.currency}>
                {item?.default_price?.currency}
              </span>{" "}
              {transformPrice(price)} to the auction from your Chronicle wallet.
              Your current balance is{" "}
              <span className={item?.default_price?.currency}>
                {item?.default_price?.currency}
              </span>{" "}
              {balance[item?.default_price?.currency as BalanceCurrency]}. Are
              you sure you want to continue?
            </p>
          }
          error={errors.CONFIRM_BID}
          onCancelClick={handleCloseWarningModal}
          onBuyClick={() => handleBuyClick(item, price)}
          loading={storeLoading}
        />
      )}
    </div>
  );
};

Item.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Item;
