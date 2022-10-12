import { ClipLoader } from "react-spinners";
import { api, URLS } from "../../../api";
import {
  ItemBoughtErrorModal,
  ItemDetailCard,
  MainLayout,
} from "../../../components";
import { DELETE_LISTING } from "../../../components/modals/ItemBoughtErrorModal/data";
import { Meta } from "../../../container";
import { useRedux } from "../../../hooks";
import {
  deleteOfferNft,
  profileActions,
  selectChronicleTradeStatus,
  selectLoadingProfile,
  selectMyNft,
  selectUserData,
  tradeActions,
  TypeTrade,
} from "../../../redux";
import { ItemDetail } from "../../../types";
import s from "./NFT.module.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  try {
    const res = await api.get(URLS.nftById.replace("<id>", `${id}`));

    if (!res) {
      return {
        notFound: true,
      };
    }

    return {
      props: { nft: { ...res?.data }, id },
    };
  } catch (error) {
    return {
      props: { nft: {}, id },
    };
  }
};

type ItemProps = { nft: ItemDetail; id: string };

const Item = (props: ItemProps) => {
  const { nft, id } = props;
  const [select, dispatch] = useRedux();
  const { push } = useRouter();

  const nftStore: ItemDetail | null = select(selectMyNft);

  const { error }: Partial<TypeTrade> = select(selectChronicleTradeStatus);
  const loading = select(selectLoadingProfile);
  const user = select(selectUserData);

  const { setError } = tradeActions;
  const { resetNft } = profileActions;

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
  };

  const handleRemoveClick = () => {
    dispatch(setError(null));
    dispatch(deleteOfferNft(nft));
  };

  useEffect(() => {
    if (nftStore && nftStore.createdTrade) {
      push({
        pathname: `/profile/${user.id}/collection`,
        query: { tab: "listings" },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftStore]);

  useEffect(() => {
    return () => {
      dispatch(resetNft());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nNft = nftStore || nft;

  return (
    <div className={s.container}>
      <Meta
        title={nNft?.item_name}
        description={nNft.description}
        image={nNft?.logo_preview}
      />
      {nNft && !loading ? (
        <ItemDetailCard
          item={nNft}
          name={nNft.item_name}
          userId={user.id}
          itemId={id}
          type="nft"
        />
      ) : (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      )}
      {error === DELETE_LISTING && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
          onBuyClick={handleRemoveClick}
        />
      )}
    </div>
  );
};

Item.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Item;
