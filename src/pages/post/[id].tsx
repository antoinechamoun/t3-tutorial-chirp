import {
  type InferGetStaticPropsType,
  type GetStaticPropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/postview";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
const SinglePostPage: NextPage<PageProps> = (props: PageProps) => {
  const { data } = api.posts.getById.useQuery({
    id: props.id,
  });

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id as string;
  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
