/**
 * WPGraphQL Client — Pro SWPPP
 *
 * Connects to: https://cms.proswppp.com/graphql
 *
 * CORS: Add to WordPress functions.php:
 *   add_filter('graphql_response_headers_to_send', function($headers) {
 *     $allowed = ['https://www2.proswppp.com', 'https://www.proswppp.com', 'http://localhost:3000'];
 *     $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
 *     if (in_array($origin, $allowed)) {
 *       $headers['Access-Control-Allow-Origin'] = $origin;
 *     }
 *     return $headers;
 *   });
 */

import { GraphQLClient } from 'graphql-request';

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://cms.proswppp.com/graphql';

export const wpClient = new GraphQLClient(WP_GRAPHQL_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WPPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories?: {
    nodes: Array<{ name: string; slug: string }>;
  };
}

export interface WPPage {
  id: string;
  title: string;
  slug: string;
  content: string;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const GET_LATEST_POSTS = `
  query GetLatestPosts($first: Int = 6) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      excerpt
      date
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

// ─── Fetch helpers (for Server Components) ───────────────────────────────────

export async function getLatestPosts(count = 6): Promise<WPPost[]> {
  try {
    const data = await wpClient.request<{ posts: { nodes: WPPost[] } }>(
      GET_LATEST_POSTS,
      { first: count }
    );
    return data.posts.nodes;
  } catch (error) {
    console.error('[WPGraphQL] getLatestPosts error:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const data = await wpClient.request<{ post: WPPost }>(GET_POST_BY_SLUG, { slug });
    return data.post;
  } catch (error) {
    console.error('[WPGraphQL] getPostBySlug error:', error);
    return null;
  }
}
