cd public


# ###################
# # remove all
# rm -rf sitemap
# mkdir sitemap
# ###################

# ###################
# remove range
if [ -d "sitemap" ]; then
    mkdir temp_sitemap
    for i in {1..73}; do
        if [ -f "sitemap/archive${i}.xml" ]; then
            mv "sitemap/archive${i}.xml" temp_sitemap/
        fi
        if [ -f "sitemap/archive${i}.xml.gz" ]; then
            mv "sitemap/archive${i}.xml.gz" temp_sitemap/
        fi
    done
    for i in {1..99}; do
        if [ -f "sitemap/search${i}.xml" ]; then
            mv "sitemap/search${i}.xml" temp_sitemap/
        fi
        if [ -f "sitemap/search${i}.xml.gz" ]; then
            mv "sitemap/search${i}.xml.gz" temp_sitemap/
        fi
    done

    rm -rf sitemap
    mkdir sitemap
    mv temp_sitemap/* sitemap/
    rmdir temp_sitemap
else
    mkdir sitemap
fi
# ###################

cd ..
cd script

# common robots generate
node ./robots.ts


# common sitemap generate
echo "common sitemap generate.."
ts-node ./sitemap-common.ts
echo "common sitemap generate complete!"

# thread-public sitemap generate
echo "thread-public sitemap generate.."
ts-node ./sitemap-thread-public.ts
echo "thread-public sitemap generate complete!"

# thread-search sitemap generate
echo "thread-search sitemap generate.."
ts-node ./sitemap-thread-search.ts
echo "thread-search sitemap generate complete!"

# sitemap compress
echo "sitemap gzip generate"
ts-node ./sitemap-compress.ts
ts-node ./sitemap.ts
echo "sitemap generate complete!"
