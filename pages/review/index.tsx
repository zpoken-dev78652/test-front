import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { CustomButton, LogoCard, MainLayout, Tooltip } from "../../components";
import { Routes } from "../../constants";
import { numberWithSpaces } from "../../helpers";
import { useRedux } from "../../hooks";
import { FacebookShareButton, TwitterShareButton } from "react-share";

import {
  selectBoughtChronicleById,
  selectBoughtTradeById,
  selectUserData,
  storeActions,
  tradeActions,
} from "../../redux";
import s from "./Review.module.scss";
import { Meta } from "../../container";
import {
  ArrowLeftIcon,
  FacebookFooterIcon,
  GridIcon,
  LinkIcon,
  SubtractIcon,
  TwitterIcon,
} from "../../components/Icons";

const Rewiev = () => {
  const [select, dispatch] = useRedux();
  const { push } = useRouter();
  const { setBoughtChronicleStoreById } = storeActions;
  const { setBoughtChronicleTradeById } = tradeActions;
  const boughtItem = select(selectBoughtChronicleById);
  const boughtItemTrade = select(selectBoughtTradeById);
  const state = boughtItem || boughtItemTrade;
  const user = select(selectUserData);

  useEffect(() => {
    if (!boughtItem && !boughtItemTrade) {
      push({
        pathname: Routes.HOME,
      });
    }

    return () => {
      dispatch(setBoughtChronicleStoreById(null));
      dispatch(setBoughtChronicleTradeById(null));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boughtItem, boughtItemTrade]);

  const onCollectionClick = () => dispatch(setBoughtChronicleStoreById(null));

  return (
    <>
      <Meta title="Chronicle | Congratulations" />
      <div className={s.modal}>
        <div className={s.icon}>
          <h2 className={s.h2}>Congratulations ... it&apos;s yours!</h2>
          <LogoCard item={state} className={s.logo} />
        </div>
        <>
          <div className={s.bottom}>
            {/* <div className={s.bottom__content}> */}
            <div className={s.names}>
              <div className={s.name}>
                {state?.name || state?.item_name}
                {state?.ipowner && (
                  <>
                    <SubtractIcon
                      className={s.nameIcon}
                      data-tip
                      data-for={state?.name + state?.id}
                      data-offset="{'top': -5, 'left': -1}"
                    />
                    <Tooltip id={state?.name + state?.id}>
                      <span className={s.ipowner}>{state.ipowner}</span>
                    </Tooltip>
                  </>
                )}
              </div>
              <div className={s.collection}>
                <CustomButton
                  value={state?.collection_name}
                  theme="link"
                  icon={<LinkIcon />}
                  linkTo={`${Routes.PROFILE}/${user.id}/collection/${state?.collection_id}`}
                />
              </div>
              <div className={s.count}>
                #{state?.num_in_collection} -{" "}
                {numberWithSpaces(state?.nft_index || 0)} /{" "}
                {numberWithSpaces(state?.total_nft_num || 0)}
              </div>
            </div>
            <div className={s.btn}>
              <div className={s.topBtnWrap}>
                <CustomButton
                  theme="transparent"
                  iconLeft={<ArrowLeftIcon />}
                  linkTo={Routes.STORE}
                  className={s.backBtn}
                />
                <FacebookShareButton
                  quote="I just bought my digital collectible on Chronicle. Get yours too at https://www.chronicle.io"
                  url={`${process.env.NEXT_PUBLIC_DOMAIN}/store/item/${state?.id}`}
                >
                  <CustomButton
                    value="share"
                    theme="transparent"
                    icon={<FacebookFooterIcon className={s.socialIcon} />}
                    className={s.facebookBtn}
                  />
                </FacebookShareButton>
                <TwitterShareButton
                  title="I just bought my digital collectible on Chronicle. Get yours too at https://www.chronicle.io"
                  url={`${process.env.NEXT_PUBLIC_DOMAIN}/store/item/${state?.id}`}
                >
                  <CustomButton
                    value="tweet"
                    theme="transparent"
                    icon={<TwitterIcon className={s.socialIcon} />}
                    className={s.tweetBtn}
                  />
                </TwitterShareButton>
              </div>
              {/* <div>
                <CustomButton
                  value="Continue shopping"
                  theme="transparent"
                  icon={<CartIcon />}
                  style={{ height: "32px" }}
                  onClick={onCollectionClick}
                  linkTo={Routes.STORE}
                />
              </div> */}

              <div>
                <CustomButton
                  value="SEE MY COLLECTION"
                  theme="violet"
                  icon={<GridIcon />}
                  style={{ height: "32px" }}
                  onClick={onCollectionClick}
                  linkTo={`/profile/${user.id}/collection`}
                />
              </div>
            </div>
            {/* </div> */}
          </div>
        </>
        <video autoPlay loop muted className={s.video}>
          <source src="/video/Chronicle-Drop_BG.mp4" type="video/mp4" />
        </video>
      </div>
    </>
  );
};

Rewiev.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Rewiev;
